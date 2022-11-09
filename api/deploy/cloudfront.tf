locals {
  s3_origin_id = "${local.app_name}-web-origin"
}

data "aws_acm_certificate" "root_cert" {
  provider    = aws.us-east-1
  domain      = "limbz.io"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
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

  aliases = ["limbz.io", "www.limbz.io"]

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
    acm_certificate_arn      = data.aws_acm_certificate.root_cert.arn
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }
}
