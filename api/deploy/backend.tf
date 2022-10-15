terraform {
  backend "s3" {
    bucket = "klubzz-state"
    key    = "state.tf"
    region = "eu-west-3"
  }
}
