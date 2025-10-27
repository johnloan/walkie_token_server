import 'package:dart_frog/dart_frog.dart';
import '../token_common.dart';

Future<Response> onRequest(RequestContext context) async {
  return handleTokenRequest(context, type: 'rtm');
}