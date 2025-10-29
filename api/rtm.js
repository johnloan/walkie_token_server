import { RtmTokenBuilder, RtmRole } from 'agora-access-token';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERT;
  const { uid } = req.body || {};

  if (!appId || !appCertificate)
    return res.status(500).json({ error: 'Missing Agora credentials' });
  if (uid === undefined) return res.status(400).json({ error: 'Missing "uid"' });

  const expireSeconds = 3600;
  const token = RtmTokenBuilder.buildToken(
    appId,
    appCertificate,
    uid.toString(),
    RtmRole.Rtm_User,
    Math.floor(Date.now() / 1000) + expireSeconds
  );

  return res.status(200).json({ token, mode: 'RTM', expireTs: Math.floor(Date.now() / 1000) + expireSeconds });
}

