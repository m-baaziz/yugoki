terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3"
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

locals {
  app_name         = "klubzz"
  jwt_secret       = "xxxxxxxxxx"
  jwt_validity_sec = "86400"
}
