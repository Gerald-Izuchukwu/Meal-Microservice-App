resource "aws_security_group" "meal_app_db_sg" {
    name = "Meal App Database Security Group"
    vpc_id = var.vpc_id

    tags = {
      Name = "Meal App DB Security Group"
      Environment = "Production"
    }
}

resource "aws_vpc_security_group_ingress_rule" "allow_db_connection_from_only_ecs" {
  security_group_id = aws_security_group.meal_app_db_sg.id
  referenced_security_group_id = aws_security_group.meal_app_ecs_sg.id
  from_port = 27017
  to_port = 27017
  ip_protocol = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.meal_app_db_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" 
}

resource "aws_security_group" "meal_app_ecs_sg" {
    name = "Meal App ECS Security Group"
    vpc_id = var.vpc_id

    # ingress {
    
    # }

    tags = {
      Name = "Meal App ECS Security Group"
      Environment = "Production"
    }
}