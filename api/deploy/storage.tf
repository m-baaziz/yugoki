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

resource "aws_s3_bucket_cors_configuration" "files" {
  bucket = aws_s3_bucket.files.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "HEAD", "POST", "DELETE"]
    allowed_origins = ["*"]
  }
}
