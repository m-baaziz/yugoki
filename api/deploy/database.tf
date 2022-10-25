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
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }
  attribute {
    name = "Owner"
    type = "S"
  }

  global_secondary_index {
    name            = "ClubOwnerIndex"
    hash_key        = "Owner"
    range_key       = "Id"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
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
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }
  attribute {
    name = "Club"
    type = "S"
  }

  global_secondary_index {
    name            = "TrainerClubIndex"
    hash_key        = "Club"
    range_key       = "Id"
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
  // Sk1 -> SITE#... | SITE#...EVENT#... | SITE#...SUBSCRIPTIONOPTION#... | SITE#...SUBSCRIPTIONOPTION#...#SUBSCRIPTION...
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
    name = "SiteGeohash"
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
    range_key       = "SiteGeohash"
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
  range_key      = "SubscriptionId"

  attribute {
    name = "SiteId"
    type = "S"
  }
  attribute {
    name = "SubscriptionId"
    type = "S"
  }
  attribute {
    name = "Date"
    type = "S"
  }

  local_secondary_index {
    name            = "DateIndex"
    range_key       = "Date"
    projection_type = "ALL"
  }

  tags = {
    AppName     = "klubzz"
    Environment = "dev"
  }
}
