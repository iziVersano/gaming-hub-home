import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { domReady, safeQuerySelector } from './utils/domReady'

// Initialize React app with DOM readiness check
domReady(() => {
  const rootElement = document.getElementById("root");
  if (rootElement instanceof Element) {
    createRoot(rootElement).render(<App />);
  }
});

// Initialize mobile drawer functionality
domReady(() => {
  const burger = safeQuerySelector('.burger');
  const drawer = safeQuerySelector('.drawer');
  
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      drawer.classList.toggle('open');
      document.body.classList.toggle('no-scroll', drawer.classList.contains('open'));
    });
  }
});
