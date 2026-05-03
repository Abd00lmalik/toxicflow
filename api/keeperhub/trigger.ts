export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'Method not allowed' })); return; }

  const apiUrl    = process.env.KEEPERHUB_API_URL;
  const apiKey    = process.env.KEEPERHUB_API_KEY;
  const workflowId = process.env.KEEPERHUB_WORKFLOW_ID;

  if (!apiUrl || !apiKey || !workflowId) {
    res.statusCode = 503;
    res.end(JSON.stringify({ triggered: false, error: 'KeeperHub not configured', missing: [!apiUrl && 'KEEPERHUB_API_URL', !apiKey && 'KEEPERHUB_API_KEY', !workflowId && 'KEEPERHUB_WORKFLOW_ID'].filter(Boolean) }));
    return;
  }

  let body = req.body ?? {};
  if (typeof body !== 'object') { try { body = JSON.parse(String(body)); } catch { body = {}; } }
  const summary = (body as any).summary ?? {};
  const toxicShareBps = summary.computedToxicShareBps ?? 0;
  const thresholdBps  = 3000;
  const thresholdExceeded = summary.thresholdExceeded ?? false;

  const payload = {
    protocol: 'toxicflow-passport', action: thresholdExceeded ? 'PAUSE_SWAPS' : 'MONITOR',
    chainId: 11155111,
    hookAddress: process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK ?? null,
    poolId: process.env.NEXT_PUBLIC_POOL_ID ?? null,
    toxicShareBps, thresholdBps, thresholdExceeded,
    manual: Boolean((body as any).manual),
    callbackUrl: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''}/api/pool-defense/pause`,
    reason: thresholdExceeded ? 'TOXIC_THRESHOLD_EXCEEDED' : 'MANUAL_TRIGGER',
    triggeredAt: new Date().toISOString(),
  };

  try {
    const webhookUrl = `${apiUrl.replace(/\/$/, '')}/workflows/${workflowId}/webhook`;
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload) });
    if (r.status === 410) { res.statusCode = 410; res.end(JSON.stringify({ triggered: false, error: 'Workflow disabled (HTTP 410) — re-enable in KeeperHub dashboard' })); return; }
    if (!r.ok) { const t = await r.text().catch(() => ''); res.statusCode = r.status; res.end(JSON.stringify({ triggered: false, error: `KeeperHub returned ${r.status}`, details: t })); return; }
    res.statusCode = 200;
    res.end(JSON.stringify({ triggered: true, workflowId, triggeredAt: payload.triggeredAt, payload }));
  } catch (err: unknown) {
    res.statusCode = 500;
    res.end(JSON.stringify({ triggered: false, error: String(err) }));
  }
}
