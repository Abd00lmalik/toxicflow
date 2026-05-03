export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.end(JSON.stringify({
    circuitBreaker: { paused: false, reason: null, txHash: null, pausedAt: null },
    hookV2Required: true,
    currentHook: process.env.NEXT_PUBLIC_TOXIC_FLOW_HOOK ?? null,
    note: 'Circuit breaker requires ToxicFlowHookV2. Stateless function — pause state not persisted between requests.',
  }));
}
