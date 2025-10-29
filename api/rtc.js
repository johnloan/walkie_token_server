import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERT;
  const { channel, uid } = req.body || {};

  if (!appId || !appCertificate)
    return res.status(500).json({ error: 'Missing Agora credentials' });
  if (!channel) return res.status(400).json({ error: 'Missing "channel"' });

  const expireSeconds = 3600; // 1h
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid || 0,
    RtcRole.PUBLISHER,
    Math.floor(Date.now() / 1000) + expireSeconds
  );

  return res.status(200).json({ token, mode: 'RTC', expireTs: Math.floor(Date.now() / 1000) + expireSeconds });
}

