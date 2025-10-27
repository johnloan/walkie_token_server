import 'dart:async';
import 'dart:convert';
import 'dart:io';

Future<void> _handleReq(HttpRequest req) async {
  // CORS
  req.response.headers.set('Access-Control-Allow-Origin', '*');
  req.response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  req.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method == 'OPTIONS') {
    req.response.statusCode = 204;
    await req.response.close();
    return;
  }

  if (req.method != 'POST') {
    req.response.statusCode = 405;
    await req.response.close();
    return;
  }

  final path = req.uri.path;
  final body = await utf8.decoder.bind(req).join();
  Map<String, dynamic> jsonBody = {};
  try {
    jsonBody = jsonDecode(body) as Map<String, dynamic>;
  } catch (_) {}

  // Read envs
  final tempToken = Platform.environment['TEMP_TOKEN'];
  final appId = Platform.environment['APP_ID'];
  final appCert = Platform.environment['APP_CERTIFICATE'];

  // Validate minimal body
  if (path == '/token/rtc' || path == '/token/all') {
    if (jsonBody['channel'] == null) {
      req.response.statusCode = 400;
      req.response.write(jsonEncode({'error': 'Missing "channel"'}));
      await req.response.close();
      return;
    }
  }
  if (jsonBody['uid'] == null) {
    req.response.statusCode = 400;
    req.response.write(jsonEncode({'error': 'Missing "uid"'}));
    await req.response.close();
    return;
  }

  // TEMP_TOKEN fast path
  if (tempToken != null && tempToken.isNotEmpty) {
    req.response.headers.set('Content-Type', 'application/json');
    req.response.write(jsonEncode({'token': tempToken, 'mode': 'TEMP_TOKEN'}));
    await req.response.close();
    return;
  }

  // If no TEMP_TOKEN is provided, for now return 501 with guidance.
  req.response.statusCode = 501;
  req.response.headers.set('Content-Type', 'application/json');
  req.response.write(jsonEncode({
    'error': 'Token generation not implemented yet',
    'hint': 'Define TEMP_TOKEN env for quick start or implement real generation with APP_ID/APP_CERTIFICATE.'
  }));
  await req.response.close();
}

void main() async {
  final server = await HttpServer.bind(InternetAddress.anyIPv4, 8080);
  await for (final req in server) {
    unawaited(_handleReq(req));
  }
}