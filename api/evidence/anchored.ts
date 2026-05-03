export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.end(JSON.stringify({ records: [], total: 0, note: 'Serverless function — in-memory cache not available. Records are stored ephemerally.' }));
}
