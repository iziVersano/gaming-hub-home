#!/usr/bin/env node
/**
 * telegram-agent.mjs
 *
 * Polls Telegram for new messages from authorized users,
 * feeds each message to `claude --print` as a code-change request,
 * and replies with the result.
 *
 * Usage:
 *   TELEGRAM_BOT_TOKEN=xxx TELEGRAM_ALLOWED_IDS=123456789 node scripts/telegram-agent.mjs
 *
 * Or set vars in .env.telegram (never commit this file):
 *   TELEGRAM_BOT_TOKEN=xxx
 *   TELEGRAM_ALLOWED_IDS=123456789,987654321   # comma-separated chat IDs
 *   TELEGRAM_POLL_INTERVAL=5000               # ms between polls (default 5000)
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(__dirname, '..');
const STATE_FILE = resolve(__dirname, '.telegram-agent-state.json');
const ENV_FILE = resolve(PROJECT_DIR, '.env.telegram');

// ── Load .env.telegram if present ─────────────────────────────────────────────
if (existsSync(ENV_FILE)) {
  const lines = readFileSync(ENV_FILE, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_IDS = (process.env.TELEGRAM_ALLOWED_IDS || '')
  .split(',').map(s => s.trim()).filter(Boolean);
const POLL_INTERVAL = parseInt(process.env.TELEGRAM_POLL_INTERVAL || '5000', 10);

if (!BOT_TOKEN) {
  console.error('❌  TELEGRAM_BOT_TOKEN is not set.');
  console.error('    Add it to .env.telegram or export it before running.');
  process.exit(1);
}

if (ALLOWED_IDS.length === 0) {
  console.warn('⚠️  TELEGRAM_ALLOWED_IDS not set — all senders will be allowed.');
  console.warn('    Set it to your Telegram user/chat ID to restrict access.');
}

// ── Persistent state (last processed update_id) ───────────────────────────────
function loadState() {
  if (existsSync(STATE_FILE)) {
    try { return JSON.parse(readFileSync(STATE_FILE, 'utf8')); } catch {}
  }
  return { lastUpdateId: 0 };
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ── Telegram API helpers ───────────────────────────────────────────────────────
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tgFetch(method, body = {}) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram ${method} error: ${json.description}`);
  return json.result;
}

async function sendMessage(chatId, text) {
  // Telegram max message length is 4096 chars
  const chunks = [];
  for (let i = 0; i < text.length; i += 4000) chunks.push(text.slice(i, i + 4000));
  for (const chunk of chunks) {
    await tgFetch('sendMessage', { chat_id: chatId, text: chunk, parse_mode: 'Markdown' });
  }
}

async function getUpdates(offset) {
  return tgFetch('getUpdates', { offset, timeout: 20, allowed_updates: ['message'] });
}

// ── Run claude on a change request ────────────────────────────────────────────
function runClaude(prompt) {
  return new Promise((resolve) => {
    const args = [
      '--print',           // non-interactive, print output then exit
      '--no-update-checks',
      '--allowedTools', 'Read,Edit,Write,Bash,Glob,Grep',
      prompt,
    ];

    let output = '';
    let error = '';

    const child = spawn('claude', args, {
      cwd: PROJECT_DIR,
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    child.stdout.on('data', (d) => { output += d.toString(); });
    child.stderr.on('data', (d) => { error += d.toString(); });

    child.on('close', (code) => {
      if (code !== 0 && !output) {
        resolve(`❌ Claude exited with code ${code}\n${error}`.trim());
      } else {
        resolve((output || error).trim());
      }
    });

    child.on('error', (err) => {
      resolve(`❌ Failed to start Claude: ${err.message}`);
    });
  });
}

// ── Process a single message ───────────────────────────────────────────────────
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const senderId = String(msg.from?.id || chatId);
  const text = msg.text || msg.caption || '';

  if (!text.trim()) return; // ignore non-text (stickers, etc.)

  // Authorization check
  if (ALLOWED_IDS.length > 0 && !ALLOWED_IDS.includes(senderId)) {
    console.log(`🚫 Rejected message from ${senderId}`);
    await sendMessage(chatId, '🚫 You are not authorized to use this bot.');
    return;
  }

  console.log(`\n📨 Request from ${senderId}: ${text.slice(0, 120)}${text.length > 120 ? '…' : ''}`);
  await sendMessage(chatId, '⏳ Processing your request — working on the code now…');

  const systemContext = `You are working on the Consoltech Nexus project at ${PROJECT_DIR}.
It is a React + TypeScript + Vite frontend with a .NET backend.
The client has sent you a change request via Telegram. Apply the change to the codebase.
After making the change, commit it with git and respond with a brief summary of what you did.
`;

  const fullPrompt = `${systemContext}\n\nClient request:\n${text}`;

  const result = await runClaude(fullPrompt);
  console.log(`✅ Done. Sending reply…`);

  await sendMessage(chatId, result || '✅ Done — no output returned.');
}

// ── Main polling loop ──────────────────────────────────────────────────────────
async function main() {
  console.log('🤖 Consoltech Telegram Agent started');
  console.log(`   Project: ${PROJECT_DIR}`);
  console.log(`   Allowed IDs: ${ALLOWED_IDS.length ? ALLOWED_IDS.join(', ') : '(everyone)'}`);
  console.log(`   Poll interval: ${POLL_INTERVAL}ms`);
  console.log('   Waiting for messages…\n');

  const state = loadState();

  while (true) {
    try {
      const updates = await getUpdates(state.lastUpdateId + 1);

      for (const update of updates) {
        state.lastUpdateId = update.update_id;
        saveState(state);

        if (update.message) {
          await handleMessage(update.message);
        }
      }
    } catch (err) {
      console.error(`⚠️  Poll error: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, POLL_INTERVAL));
  }
}

main();
