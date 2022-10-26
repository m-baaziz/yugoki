resource "aws_dynamodb_table" "sport" {
  name           = "Sport"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  tags = {
    AppName     = "klubzz"
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "club" {
  name           = "Club"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "ClubId"
  range_key      = "Sk1"

  attribute {
    name = "ClubId"
    type = "S"
  }
  attribute {
    name = "Sk1" # CLUB#... | CLUB#...#TRAINER#...
    type = "S"
  }
  attribute {
    name = "ClubOwner"
    type = "S"
  }

  global_secondary_index {
    name               = "ClubOwnerIndex"
    hash_key           = "ClubOwner"
    range_key          = "ClubId"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "INCLUDE"
    non_key_attributes = ["ClubName", "ClubLogo"]
  }

  tags = {
    AppName     = "klubzz"
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "trainer" {
  name           = "Trainer"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "ClubId"
  range_key      = "TrainerId"

  attribute {
    name = "ClubId"
    type = "S"
  }
  attribute {
    name = "TrainerId"
    type = "S"
  }

  global_secondary_index {
    name = "TrainerClubIndex"

    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    AppName     = "klubzz"
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "site" {
  name           = "Site"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "SiteId"
  range_key      = "Sk1"

  attribute {
    name = "SiteId"
    type = "S"
  }
  // Sk1 -> SITE#... | SITE#...EVENT#... | SITE#...SUBSCRIPTIONOPTION#...
  attribute {
    name = "Sk1"
    type = "S"
  }
  attribute {
    name = "SiteClub"
    type = "S"
  }
  attribute {
    name = "SiteSport"
    type = "S"
  }
  attribute {
    name = "SiteGeohash#SiteId"
    type = "S"
  }

  global_secondary_index {
    name            = "SiteClubIndex"
    hash_key        = "SiteClub"
    range_key       = "Sk1"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "SiteSportGeohashIndex"
    hash_key        = "SiteSport"
    range_key       = "SiteGeohash#SiteId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    AppName     = "klubzz"
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "file" {
  name           = "File"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  tags = {
    AppName     = "klubzz"
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "subscription" {
  name           = "Subscription"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "SiteId"
  range_key      = "Sk1"

  attribute {
    name = "SiteId"
    type = "S"
  }
  attribute {
    name = "Sk1" # SubscriptionOptionId#SubscriptionId
    type = "S"
  }
  attribute {
    name = "Sk2" # Date#SubscriptionOptionId#SubscriptionId
    type = "S"
  }

  local_secondary_index {
    name            = "DateIndex"
    range_key       = "Sk2"
    projection_type = "ALL"
  }

  tags = {
    AppName     = "klubzz"
    Environment = "dev"
  }
}
