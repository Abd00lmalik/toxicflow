// Shared utilities for Vercel serverless functions
// No framework deps — plain Node.js http

export function json(res: any, data: unknown, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export async function readBody(req: any): Promise<unknown> {
  // Vercel auto-parses JSON bodies — use req.body if available
  if (req.body !== undefined) return req.body;
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c: Buffer) => { raw += c.toString(); });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

export function makeSepoliaTransport() {
  const { http, fallback } = require('viem');
  return fallback([
    http(process.env.SEPOLIA_RPC_URL ?? ''),
    http('https://ethereum-sepolia-rpc.publicnode.com'),
    http('https://rpc.sepolia.org'),
  ]);
}
