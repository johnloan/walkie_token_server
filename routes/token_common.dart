import 'dart:convert';
import 'dart:io';
import 'package:dart_frog/dart_frog.dart';

Future<Response> handleTokenRequest(RequestContext context, {required String type}) async {
  final body = await context.request.json() as Map<String, dynamic>? ?? {};

  if (type != 'rtm' && body['channel'] == null) {
    return Response.json(statusCode: 400, body: {'error': 'Missing "channel"'});
  }
  if (body['uid'] == null) {
    return Response.json(statusCode: 400, body: {'error': 'Missing "uid"'});
  }

  final tempToken = Platform.environment['TEMP_TOKEN'];
  if (tempToken != null && tempToken.isNotEmpty) {
    return Response.json(body: {'token': tempToken, 'mode': 'TEMP_TOKEN'});
  }

  return Response.json(statusCode: 501, body: {
    'error': 'TEMP_TOKEN not set',
    'hint': 'Define TEMP_TOKEN env var in Vercel Project Settings.'
  });
}