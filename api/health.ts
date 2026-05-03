export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, runtime: 'vercel-function', ts: new Date().toISOString() }));
}
