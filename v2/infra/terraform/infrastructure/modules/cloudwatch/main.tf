resource "aws_cloudwatch_log_group" "auth_service" {
  name              = "/ecs/mealapp/auth-service"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "product_service" {
  name              = "/ecs/mealapp/product-service"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "delivery_service" {
  name              = "/ecs/mealapp/delivery-service"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "order_service" {
  name              = "/ecs/mealapp/order-service"
  retention_in_days = 7
}