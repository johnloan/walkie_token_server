import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = pkg;

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
  if (!channel || uid === undefined)
    return res.status(400).json({ error: 'Missing "channel" or "uid"' });

  const expireSeconds = 3600;
  const now = Math.floor(Date.now() / 1000);
  const rtcToken = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid,
    RtcRole.PUBLISHER,
    now + expireSeconds
  );
  const rtmToken = RtmTokenBuilder.buildToken(
    appId,
    appCertificate,
    uid.toString(),
    RtmRole.Rtm_User,
    now + expireSeconds
  );

  return res.status(200).json({
    rtc: rtcToken,
    rtm: rtmToken,
    expireTs: now + expireSeconds
  });
}
