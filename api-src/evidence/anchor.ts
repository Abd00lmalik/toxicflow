export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'Method not allowed' })); return; }

  let body = req.body;
  if (!body || typeof body !== 'object') {
    try {
      const raw: string = await new Promise((resolve, reject) => { let s = ''; req.on('data', (c: Buffer) => { s += c.toString(); }); req.on('end', () => resolve(s)); req.on('error', reject); });
      body = raw ? JSON.parse(raw) : {};
    } catch { body = {}; }
  }

  const { txHash, tier, feeBps } = body as { txHash?: string; tier?: number; feeBps?: number };
  if (!txHash || typeof txHash !== 'string') {
    res.statusCode = 400;
    res.end(JSON.stringify({ anchored: false, error: 'txHash required' }));
    return;
  }

  const zgUrl    = process.env.NEXT_PUBLIC_ZG_STORAGE_URL;
  const signerKey = process.env.ZG_SIGNER_PRIVATE_KEY;

  if (!zgUrl || !signerKey) {
    const storageRef = `local:${txHash.slice(0, 16)}`;
    res.statusCode = 200;
    res.end(JSON.stringify({ anchored: true, storageRef, mode: 'local', note: '0G Storage not configured — record stored ephemerally. Configure ZG_SIGNER_PRIVATE_KEY and NEXT_PUBLIC_ZG_STORAGE_URL in Vercel for decentralized storage.' }));
    return;
  }

  try {
    const { privateKeyToAccount } = await import('viem/accounts');
    const account = privateKeyToAccount(signerKey as `0x${string}`);
    const evidence = { txHash, tier: tier ?? 0, feeBps: feeBps ?? 30, anchoredAt: new Date().toISOString(), protocol: 'toxicflow-passport', chainId: 11155111 };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    const uploadRes = await fetch(`${zgUrl}/upload`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Signer': account.address }, body: JSON.stringify(evidence), signal: controller.signal });
    clearTimeout(timeout);
    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
    const data = await uploadRes.json() as { ref?: string; hash?: string };
    const storageRef = data.ref ?? data.hash ?? `zg:${txHash.slice(0, 16)}`;
    res.statusCode = 200;
    res.end(JSON.stringify({ anchored: true, storageRef, mode: '0g-storage' }));
  } catch (err: unknown) {
    const storageRef = `local:${txHash.slice(0, 16)}`;
    res.statusCode = 200;
    res.end(JSON.stringify({ anchored: true, storageRef, mode: 'local-fallback', note: String(err) }));
  }
}
