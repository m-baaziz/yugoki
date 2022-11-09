output "s3-bucket-files" {
  value = aws_s3_bucket.files.arn
}

output "graphql-lambda" {
  description = "Name of the Graphql Lambda function."

  value = aws_lambda_function.graphql.function_name
}

output "grahql-url" {
  description = "Base URL for Qraphql API Gateway stage."

  value = aws_apigatewayv2_stage.graphql_dev.invoke_url
}

output "ws-lambda" {
  description = "Name of the WS Lambda function."

  value = aws_lambda_function.ws.function_name
}

output "ws-url" {
  description = "Base URL for WS API Gateway stage."

  value = aws_apigatewayv2_stage.ws_dev.invoke_url
}

output "ws-api-id" {
  description = "Endpoint url for WS API Gateway stage."

  value = aws_apigatewayv2_stage.ws_dev.api_id
}

output "ws-api-stage" {
  description = "Stage of the WS API Gateway."

  value = aws_apigatewayv2_stage.ws_dev.name
}

output "ws-api-execution-arn" {
  description = "Execution ARN of the WS API."

  value = aws_apigatewayv2_stage.ws_dev.execution_arn
}

output "cloudfront-domain-name" {
  value = aws_cloudfront_distribution.web.domain_name
}

output "limbz-io-certificate-arn" {
  value = data.aws_acm_certificate.root_cert.arn
}
