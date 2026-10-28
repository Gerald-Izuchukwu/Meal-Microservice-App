# ---------------------------------------------------------
# AUTH
# ---------------------------------------------------------

resource "aws_ssm_parameter" "auth" {
  tier = "Standard"

  for_each = local.auth_parameters

  name  = "/meal-app/auth/${each.key}"
  value = each.value

  type = contains([
    "RABBITMQ_CONNECTION_STRING",
    "RABBITMQ_DEFAULT_PASS",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN",
    "AWS_SecretAccessKey",
    "GMAIL_PASS"
  ], each.key) ? "SecureString" : "String"

  tags = {
    Project = "meal-app"
    Service = "auth"
  }
}

# ---------------------------------------------------------
# PRODUCT
# ---------------------------------------------------------

resource "aws_ssm_parameter" "product" {
  tier = "Standard"

  for_each = local.product_parameters

  name = "/meal-app/product/${each.key}"
  type = contains([
    "RABBITMQ_CONNECTION_STRING",
    "RABBITMQ_DEFAULT_PASS",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN"
  ], each.key) ? "SecureString" : "String"

  value = each.value

  tags = {
    Service = "product"
    Project = "meal-app"
  }
}

# ---------------------------------------------------------
# ORDER
# ---------------------------------------------------------

resource "aws_ssm_parameter" "order" {
  tier = "Standard" 
  for_each = local.order_parameters

  name = "/meal-app/order/${each.key}"
  type = contains([
    "RABBITMQ_CONNECTION_STRING",
    "RABBITMQ_DEFAULT_PASS",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN"
  ], each.key) ? "SecureString" : "String"

  value = each.value

  tags = {
    Service = "order"
    Project = "meal-app"
  }
}


# ---------------------------------------------------------
# DELIVERY
# ---------------------------------------------------------

resource "aws_ssm_parameter" "delivery" {
  tier = "Standard"
  for_each = local.delivery_parameters

  name = "/meal-app/delivery/${each.key}"
  type = contains([
    "RABBITMQ_CONNECTION_STRING",
    "RABBITMQ_DEFAULT_PASS",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN"
  ], each.key) ? "SecureString" : "String"

  value = each.value

  tags = {
    Service = "delivery"
    Project = "meal-app"
  }
}