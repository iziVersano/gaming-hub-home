"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key-change-in-production';
const ADMIN_EMAIL = 'admin@consoltech.com';
const ADMIN_PASSWORD = 'Admin123!';
async function POST(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.consoltech.co.il');
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    return res.status(200).json({
        access_token: token,
        expires_in: 28800,
    });
}
