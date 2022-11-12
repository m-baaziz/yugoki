// ------- S3 ---------

data "archive_file" "graphql" {
  type = "zip"

  source_dir  = "${path.module}/graphql-lambda"
  output_path = "${path.module}/graphql-lambda.zip"
}

resource "aws_s3_object" "lambda_grapqhl" {
  bucket = aws_s3_bucket.lambdas.id

  key    = "graphql.zip"
  source = data.archive_file.graphql.output_path

  etag = filemd5(data.archive_file.graphql.output_path)
}

// ------- LAMBDA ---------

resource "aws_lambda_function" "graphql" {
  function_name = "Graphql"

  s3_bucket = aws_s3_bucket.lambdas.id
  s3_key    = aws_s3_object.lambda_grapqhl.key

  runtime = "nodejs16.x"
  handler = "handler.graphqlHandler"
  timeout = 10

  source_code_hash = data.archive_file.graphql.output_base64sha256

  role = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      JWT_SECRET                               = "${local.jwt_secret}"
      JWT_VALIDITY_SEC                         = "${local.jwt_validity_sec}"
      S3_REGION                                = "eu-west-3"
      FILES_BUCKET                             = "${aws_s3_bucket.files.id}"
      FILES_PRESIGNED_URLS_VALIDITY_PERIOD_GET = "3600"
      FILES_PRESIGNED_URLS_VALIDITY_PERIOD_PUT = "3600"
      WS_API_ID                                = "${aws_apigatewayv2_stage.ws_dev.api_id}"
      WS_API_STAGE                             = "${aws_apigatewayv2_stage.ws_dev.name}"
    }
  }
}

// ------- CLOUDWATCH ---------

resource "aws_cloudwatch_log_group" "graphql" {
  name = "/aws/lambda/${aws_lambda_function.graphql.function_name}"

  retention_in_days = 30
}

// ------- IAM ---------

resource "aws_iam_role" "lambda_exec" {
  name = "graphql_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "graphql_dynamodb" {
  role = aws_iam_role.lambda_exec.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
        ]
        Effect = "Allow"
        Resource = [
          "${aws_dynamodb_table.user.arn}",
          "${aws_dynamodb_table.user.arn}/index/*",
          "${aws_dynamodb_table.club.arn}",
          "${aws_dynamodb_table.club.arn}/index/*",
          "${aws_dynamodb_table.fileUpload.arn}",
          "${aws_dynamodb_table.fileUpload.arn}/index/*",
          "${aws_dynamodb_table.site.arn}",
          "${aws_dynamodb_table.site.arn}/index/*",
          "${aws_dynamodb_table.sport.arn}",
          "${aws_dynamodb_table.sport.arn}/index/*",
          "${aws_dynamodb_table.subscription.arn}",
          "${aws_dynamodb_table.subscription.arn}/index/*",
          "${aws_dynamodb_table.site_chat.arn}",
          "${aws_dynamodb_table.site_chat.arn}/index/*",
          "${aws_dynamodb_table.ws_connection.arn}",
          "${aws_dynamodb_table.ws_connection.arn}/index/*"
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy" "graphql_s3" {
  role = aws_iam_role.lambda_exec.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:ListBucket",
        ]
        Effect   = "Allow"
        Resource = ["${aws_s3_bucket.files.arn}"]
      },
      {
        Action = [
          "s3:*Object",
        ]
        Effect   = "Allow"
        Resource = ["${aws_s3_bucket.files.arn}/*"]
      },
    ]
  })
}

resource "aws_iam_role_policy" "graphql_execute_api" {
  role = aws_iam_role.lambda_exec.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "execute-api:*"
        ]
        Effect   = "Allow"
        Resource = ["${aws_apigatewayv2_stage.ws_dev.execution_arn}/*"]
      }
    ]
  })
}

data "aws_ses_domain_identity" "limbz_io" {
  domain = "limbz.io"
}

resource "aws_iam_role_policy" "graphql_ses" {
  role = aws_iam_role.lambda_exec.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Effect   = "Allow"
        Resource = ["*"]
      }
    ]
  })
}

// ------- API GATEWAY ---------

resource "aws_apigatewayv2_api" "graphql_gw" {
  name          = "graphql_lambda_gw"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["*"]
    allow_headers = ["*"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "graphql_dev" {
  api_id = aws_apigatewayv2_api.graphql_gw.id

  name        = "dev"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.graphql_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "graphql_gw" {
  api_id = aws_apigatewayv2_api.graphql_gw.id

  integration_uri    = aws_lambda_function.graphql.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "graphql_gw" {
  api_id = aws_apigatewayv2_api.graphql_gw.id

  route_key = "POST /api"
  target    = "integrations/${aws_apigatewayv2_integration.graphql_gw.id}"
}

resource "aws_cloudwatch_log_group" "graphql_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.graphql_gw.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "graphql_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.graphql.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.graphql_gw.execution_arn}/*/*"
}
