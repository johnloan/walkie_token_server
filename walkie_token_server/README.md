# walkie_token_server (Dart Frog + Vercel)

Serverless Token Server per Agora (RTC + RTM) pensato per deploy su **Vercel**.
Per partire SUBITO, usa un **token temporaneo** via variabile d'ambiente `TEMP_TOKEN`.
In qualunque momento potrai sostituire la logica con un vero generatore di token (server-side).

## Endpoints (POST + JSON)
- `POST /token/rtc` — body: `{ "channel": "MrTravis", "uid": 0 }`
- `POST /token/rtm` — body: `{ "uid": 0 }`
- `POST /token/all` — body: `{ "channel": "MrTravis", "uid": 0 }`

> Al momento questi endpoint **ritornano un token statico** preso dalla variabile `TEMP_TOKEN`.
> È perfetto per mettere subito online l'endpoint e collegare l'app. In seguito potrai inserire
> la generazione reale di token con App Certificate (vedi sezione **Upgrade a generazione reale**).

## Variabili d'ambiente richieste
- `APP_ID` — il tuo Agora App ID (opzionale per la modalità TEMP_TOKEN)
- `APP_CERTIFICATE` — il tuo Agora App Certificate (necessario **solo** per la generazione reale)
- `TEMP_TOKEN` — un token temporaneo (copiato dalla console) da restituire per ora

Su **Vercel**, definiscile in *Project Settings → Environment Variables*.

## Deploy su Vercel (rapido)
1. Installa Dart: https://dart.dev/get-dart
2. Installa Dart Frog CLI:
   ```bash
   dart pub global activate dart_frog_cli
   ```
3. (Facoltativo) Test in locale:
   ```bash
   dart_frog dev
   ```
4. Deploy su Vercel (con adapter):
   - Aggiungi l'adapter:
     ```bash
     dart pub add dart_frog
     dart pub add shelf shelf_router shelf_cors
     ```
   - Inizializza repo git e push su GitHub
   - Importa su Vercel e configura le env (`APP_ID`, `APP_CERTIFICATE`, `TEMP_TOKEN`)
   - Vercel rileverà `vercel.json` e userà l'entrypoint indicato.