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

locals {
  app_name         = "klubzz"
  jwt_secret       = "xxxxxxxxxx"
  jwt_validity_sec = "86400"
}
