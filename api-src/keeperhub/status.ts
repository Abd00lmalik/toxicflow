export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.end(JSON.stringify({ configured: Boolean(process.env.KEEPERHUB_API_URL && process.env.KEEPERHUB_API_KEY), live: false, lastTriggeredAt: null, note: 'Stateless function — trigger state not persisted' }));
}
