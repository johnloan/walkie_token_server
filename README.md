# walkie_token_server (Dart Frog + Vercel) — FULL VERSION

Serverless Token Server per Agora (RTC + RTM) con:
✅ Dart Frog sorgente (per sviluppo locale)
✅ Node Adapter per Vercel (deploy immediato)
✅ CORS abilitato
✅ Endpoints POST /token/... (root)
✅ Supporto TEMP_TOKEN per partire subito
📌 Perfetto per la tua app Walkie-Talkie Flutter

---

## 📍 Endpoints (POST + JSON)

| Endpoint | Body richiesto | Descrizione |
|----------|----------------|--------------|
| `/token/rtc` | `{ "channel": "MrTravis", "uid": 0 }` | Token solo RTC |
| `/token/rtm` | `{ "uid": 0 }` | Token solo RTM |
| `/token/all` | `{ "channel": "MrTravis", "uid": 0 }` | Token RTC + RTM |

> Per ora risponde con TEMP_TOKEN. In seguito potrai attivare token reali.

---

## 🔧 Variabili d'ambiente richieste

Da impostare su Vercel → Project → Settings → Environment Variables:

| Key | Required | Description |
|-----|----------|-----------------------------|
| TEMP_TOKEN | ✅ | Token temporaneo di Agora |
| APP_ID | ❌ | Per generazione reale in futuro |
| APP_CERTIFICATE | ❌ | Per generazione reale in futuro |

---

## 🚀 Deploy su Vercel

1. Carica i file nella root del tuo repo GitHub *(non dentro una cartella)*
2. Su Vercel, importa il repo
3. Imposta `TEMP_TOKEN` nelle env
4. Deploy parte automaticamente

---

## 🧪 Test

### Test GET rapido (routing)
Apri nel browser:
```
https://<tuo-progetto>.vercel.app/token/rtc
```
Risposta attesa:
```json
{"error":"Missing \"uid\""}
```

### Test POST token (Hoppscotch)
POST → `https://<tuo-progetto>.vercel.app/token/all`  
Body JSON:
```json
{ "channel": "MrTravis", "uid": 0 }
```

Risposta attesa:
```json
{ "token": "XXXXXXXX", "mode": "TEMP_TOKEN" }
```

---

## 📱 Integrazione Flutter (esempio)

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<String?> fetchAgoraToken(String channel, int uid) async {
  final url = Uri.parse('https://<tuo-progetto>.vercel.app/token/all');
  final res = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'channel': channel, 'uid': uid}),
  );

  if (res.statusCode == 200) {
    final data = jsonDecode(res.body);
    return data['token'] as String;
  }
  return null;
}
```

Poi nel tuo codice Agora:

```dart
final token = await fetchAgoraToken("MrTravis", 0);
await _engine.joinChannel(
  token: token ?? "",
  channelId: "MrTravis",
  uid: 0,
  options: const ChannelMediaOptions(
    autoSubscribeAudio: true,
    publishMicrophoneTrack: false,
  ),
);
```

---

## 🧠 Upgrade a generazione token reale (quando vuoi)

Quando vuoi smettere di usare TEMP_TOKEN:

- Aggiungi App ID e Certificate alle env
- Implementa la generazione nel file `token_generator.dart`
- Mantieni gli stessi endpoints (Flutter non cambia)

---

Buon deploy 🚀