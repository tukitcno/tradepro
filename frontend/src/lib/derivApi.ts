// Utility for connecting to Deriv WebSocket API
// Usage: import { connectDeriv, sendDerivMessage } from './derivApi';

let ws = null;

export function connectDeriv(onMessage, onOpen, onError, onClose) {
  ws = new WebSocket('wss://ws.deriv.com/websockets/v3');
  ws.onopen = onOpen || (() => {});
  ws.onmessage = onMessage || (() => {});
  ws.onerror = onError || (() => {});
  ws.onclose = onClose || (() => {});
  return ws;
}

export function sendDerivMessage(msg) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  } else {
    throw new Error('WebSocket is not connected.');
  }
}

export function closeDerivConnection() {
  if (ws) ws.close();
}
