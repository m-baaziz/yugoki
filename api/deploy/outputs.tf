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
