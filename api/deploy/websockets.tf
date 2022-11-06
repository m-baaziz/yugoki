// ------- S3 ---------

data "archive_file" "ws" {
  type = "zip"

  source_dir  = "${path.module}/ws-lambda"
  output_path = "${path.module}/ws-lambda.zip"
}

resource "aws_s3_object" "lambda_ws" {
  bucket = aws_s3_bucket.lambdas.id

  key    = "ws-lambda.zip"
  source = data.archive_file.ws.output_path

  etag = filemd5(data.archive_file.ws.output_path)
}

// ------- LAMBDA ---------

resource "aws_lambda_function" "ws" {
  function_name = "Websockets"

  s3_bucket = aws_s3_bucket.lambdas.id
  s3_key    = aws_s3_object.lambda_ws.key

  runtime = "nodejs16.x"
  handler = "handler.wsHandler"

  source_code_hash = data.archive_file.ws.output_base64sha256

  role = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      JWT_SECRET       = "${local.jwt_secret}"
      JWT_VALIDITY_SEC = "${local.jwt_validity_sec}"
      WS_API_ID        = "${aws_apigatewayv2_stage.ws_dev.api_id}"
      WS_API_STAGE     = "${aws_apigatewayv2_stage.ws_dev.name}"
    }
  }
}

// ------- CLOUDWATCH ---------

resource "aws_cloudwatch_log_group" "ws" {
  name = "/aws/lambda/${aws_lambda_function.ws.function_name}"

  retention_in_days = 30
}

// ------- API GATEWAY ---------

resource "aws_apigatewayv2_api" "ws_gw" {
  name                       = "ws_lambda_gw"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "ws_dev" {
  api_id = aws_apigatewayv2_api.ws_gw.id

  name        = "dev"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "ws_gw" {
  api_id = aws_apigatewayv2_api.ws_gw.id

  integration_uri    = aws_lambda_function.ws.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "ws_gw_connect" {
  api_id = aws_apigatewayv2_api.ws_gw.id

  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_gw.id}"
}

resource "aws_apigatewayv2_route" "ws_gw_disconnect" {
  api_id = aws_apigatewayv2_api.ws_gw.id

  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_gw.id}"
}

resource "aws_apigatewayv2_route" "ws_gw_default" {
  api_id = aws_apigatewayv2_api.ws_gw.id

  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.ws_gw.id}"
}

resource "aws_cloudwatch_log_group" "ws_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.ws_gw.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "ws_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.ws_gw.execution_arn}/*/*"
}
