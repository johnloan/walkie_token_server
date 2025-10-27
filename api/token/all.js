export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).end();

  const tempToken = process.env.TEMP_TOKEN || '';
  try {
    const { channel, uid } = req.body || {};
    if (!channel) return res.status(400).json({ error: 'Missing "channel"' });
    if (uid === undefined) return res.status(400).json({ error: 'Missing "uid"' });

    if (!tempToken) {
      return res.status(501).json({
        error: 'TEMP_TOKEN not set',
        hint: 'Add TEMP_TOKEN env var in Vercel Project Settings.',
      });
    }

    return res.status(200).json({ token: tempToken, mode: 'TEMP_TOKEN' });
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
}
