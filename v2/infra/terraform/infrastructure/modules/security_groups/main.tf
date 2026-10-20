resource "aws_security_group" "meal_app_db_sg" {
  name   = "Meal App Database Security Group"
  vpc_id = var.vpc_id

  tags = {
    Name        = "Meal App DB Security Group"
    Environment = "Production"
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_db_connection_from_only_ecs" {
  security_group_id            = aws_security_group.meal_app_db_sg.id
  referenced_security_group_id = aws_security_group.meal_app_ecs_sg.id
  from_port                    = 27017
  to_port                      = 27017
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.meal_app_db_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_security_group" "user_auth_ecs_sg" {
  name   = "User Auth ECS Security Group"
  vpc_id = var.vpc_id

  ingress {
    from_port   = var.auth_port
    to_port     = var.auth_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name        = "Meal APP User Auth ECS Security Group"
    Environment = "Production"
  }
}


resource "aws_security_group" "product_ecs_sg" {
  name   = "Product ECS Security Group"
  vpc_id = var.vpc_id

  ingress {
    from_port   = var.product_port
    to_port     = var.product_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {
    Name        = "Meal APP Product ECS Security Group"
    Environment = "Production"
  }
}


resource "aws_security_group" "order_ecs_sg" {
  name   = "Order ECS Security Group"
  vpc_id = var.vpc_id

  ingress {
    from_port   = var.order_port
    to_port     = var.order_port
    protocol    = "tcp"
    security_groups = [aws_security_group.delivery_ecs_sg.id, aws_security_group.product_ecs_sg.id]

  }

  tags = {
    Name        = "Meal APP Order ECS Security Group"
    Environment = "Production"
  }
}

resource "aws_security_group" "delivery_ecs_sg" {
  name   = "Delivery ECS Security Group"
  vpc_id = var.vpc_id

  ingress {
    from_port   = var.delivery_port
    to_port     = var.delivery_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "Meal APP Delivery ECS Security Group"
    Environment = "Production"
  }
}
