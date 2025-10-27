import 'package:dart_frog/dart_frog.dart';

Handler middleware(Handler handler) {
  return handler.use(_cors());
}

Middleware _cors() {
  return (handler) {
    return (context) async {
      if (context.request.method == HttpMethod.options) {
        return Response(statusCode: 204, headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        });
      }
      final response = await handler(context);
      return response.copyWith(headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
      });
    };
  };
}