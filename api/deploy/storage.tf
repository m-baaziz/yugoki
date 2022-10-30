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

// ---- WEB CLOUDFRONT -------

locals {
  s3_origin_id = "${local.app_name}-web-origin"
}

resource "aws_cloudfront_origin_access_identity" "web" {
  comment = local.s3_origin_id
}

resource "aws_cloudfront_distribution" "web" {
  origin {
    domain_name = aws_s3_bucket.web.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.web.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Cloudfront distribution for ${local.app_name} web hosting"
  default_root_object = "index.html"

  # aliases = ["mysite.example.com", "yoursite.example.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["FR", "JP"]
    }
  }

  tags = {
    Environment = "prod"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
