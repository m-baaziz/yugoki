resource "aws_dynamodb_table" "user" {
  name           = "User"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "UserEmail"
    type = "S"
  }

  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "UserEmail"
    range_key       = "UserId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    AppName     = local.app_name
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "sport" {
  name           = "Sport"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "SportId"

  attribute {
    name = "SportId"
    type = "S"
  }

  tags = {
    AppName     = local.app_name
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
    name            = "ClubOwnerIndex"
    hash_key        = "ClubOwner"
    range_key       = "ClubId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    AppName     = local.app_name
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
    name = "Sk2" # GEOHASH#...#SITE#...
    type = "S"
  }
  attribute {
    name = "ClubId"
    type = "S"
  }
  attribute {
    name = "SportId"
    type = "S"
  }

  global_secondary_index {
    name            = "SiteClubIndex"
    hash_key        = "ClubId"
    range_key       = "Sk1"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "SiteSportGeohashIndex"
    hash_key        = "SportId"
    range_key       = "Sk2"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    AppName     = local.app_name
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "fileUpload" {
  name           = "FileUpload"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "FileUploadId"

  attribute {
    name = "FileUploadId"
    type = "S"
  }

  tags = {
    AppName     = local.app_name
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
    AppName     = local.app_name
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "site_chat" {
  name           = "SiteChat"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "RoomId"
  range_key      = "Sk1"

  attribute {
    name = "RoomId"
    type = "S"
  }

  attribute {
    name = "SiteId"
    type = "S"
  }

  attribute {
    name = "RoomUserId"
    type = "S"
  }

  attribute {
    name = "Sk1" # ROOM#... | ROOM#...#MESSAGE#...
    type = "S"
  }

  attribute {
    name = "Sk2" # ROOMDATE#...#ROOMID#...
    type = "S"
  }

  attribute {
    name = "Sk3" # MESSAGEDATE#...#MESSAGEID#...
    type = "S"
  }

  global_secondary_index {
    name            = "SiteIndex"
    hash_key        = "SiteId"
    range_key       = "Sk2"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "UserIndex"
    hash_key        = "RoomUserId"
    range_key       = "Sk2"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "MessageIndex"
    hash_key        = "RoomId"
    range_key       = "Sk3"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    AppName     = local.app_name
    Environment = "dev"
  }
}

resource "aws_dynamodb_table" "ws_connection" {
  name           = "WsConnection"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "UserId"
  ttl {
    attribute_name = "Ttl"
    enabled        = true
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "ConnectionId"
    type = "S"
  }

  global_secondary_index {
    name            = "ConnectionIdIndex"
    hash_key        = "ConnectionId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  tags = {
    AppName     = local.app_name
    Environment = "dev"
  }
}
