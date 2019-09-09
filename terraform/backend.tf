terraform {
  backend "s3" {
    bucket = "omniboard-tfstate"
    key    = "data"
    region = "us-east-1"
  }
}
