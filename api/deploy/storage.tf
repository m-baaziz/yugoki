// ----- LAMBDA ------

resource "aws_s3_bucket" "lambdas" {
  bucket = "${local.app_name}-lambdas"
  tags = {
    Environment = "dev"
  }
}

resource "aws_s3_bucket_acl" "lambdas" {
  bucket = aws_s3_bucket.lambdas.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "lambdas" {
  bucket = aws_s3_bucket.lambdas.id
  versioning_configuration {
    status = "Disabled"
  }
}

// ----- FILES ------

resource "aws_s3_bucket" "files" {
  bucket = "${local.app_name}-files"
  tags = {
    Environment = "dev"
  }
}

resource "aws_s3_bucket_acl" "files" {
  bucket = aws_s3_bucket.files.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "files" {
  bucket = aws_s3_bucket.files.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "files" {
  bucket = aws_s3_bucket.files.id

  cors_rule {
    allowed_origins = ["*"]
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "HEAD", "POST", "DELETE"]
  }
}

// ----- WEB S3 ------

resource "aws_s3_bucket" "web" {
  bucket = "${local.app_name}-web-hosting"
  tags = {
    Environment = "dev"
  }
}

resource "aws_s3_bucket_acl" "web" {
  bucket = aws_s3_bucket.web.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "web" {
  bucket = aws_s3_bucket.web.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_object" "web_html" {
  for_each = fileset("../../web/build", "**/*.html")

  bucket       = aws_s3_bucket.web.bucket
  key          = each.value
  source       = "../../web/build/${each.value}"
  etag         = filemd5("../../web/build/${each.value}")
  content_type = "text/html"
}

resource "aws_s3_object" "web_svg" {
  for_each = fileset("../../web/build", "**/*.svg")

  bucket       = aws_s3_bucket.web.bucket
  key          = each.value
  source       = "../../web/build/${each.value}"
  etag         = filemd5("../../web/build/${each.value}")
  content_type = "image/svg+xml"
}

resource "aws_s3_object" "web_ico" {
  for_each = fileset("../../web/build", "**/*.ico")

  bucket       = aws_s3_bucket.web.bucket
  key          = each.value
  source       = "../../web/build/${each.value}"
  etag         = filemd5("../../web/build/${each.value}")
  content_type = "image/x-icon"
}

resource "aws_s3_object" "web_css" {
  for_each = fileset("../../web/build", "**/*.css")

  bucket       = aws_s3_bucket.web.bucket
  key          = each.value
  source       = "../../web/build/${each.value}"
  etag         = filemd5("../../web/build/${each.value}")
  content_type = "text/css"
}

resource "aws_s3_object" "web_js" {
  for_each = fileset("../../web/build", "**/*.js")

  bucket       = aws_s3_bucket.web.bucket
  key          = each.value
  source       = "../../web/build/${each.value}"
  etag         = filemd5("../../web/build/${each.value}")
  content_type = "application/javascript"
}

resource "aws_s3_object" "web_png" {
  for_each = fileset("../../web/build", "**/*.png")

  bucket       = aws_s3_bucket.web.bucket
  key          = each.value
  source       = "../../web/build/${each.value}"
  etag         = filemd5("../../web/build/${each.value}")
  content_type = "image/png"
}

resource "aws_s3_object" "web_json" {
  for_each = fileset("../../web/build", "**/*.json")

  bucket       = aws_s3_bucket.web.bucket
  key          = each.value
  source       = "../../web/build/${each.value}"
  etag         = filemd5("../../web/build/${each.value}")
  content_type = "application/json"
}

data "aws_iam_policy_document" "web_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.web.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.web.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "web_s3_policy" {
  bucket = aws_s3_bucket.web.id
  policy = data.aws_iam_policy_document.web_s3_policy.json
}

resource "aws_s3_bucket_public_access_block" "web_s3_policy" {
  bucket = aws_s3_bucket.web.id

  block_public_acls   = true
  block_public_policy = true
}
