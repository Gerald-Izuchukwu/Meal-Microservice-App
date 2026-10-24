# ── ALB SG — accepts HTTPS/HTTP from internet ────────────────────────────────
resource "aws_security_group" "meal_app_alb_sg" {
  name   = "meal_app_alb_sg"
  vpc_id = var.vpc_id
  tags = {
    Name        = "meal_app_alb_sg",
    Environment = "Production"
  }
}

resource "aws_vpc_security_group_ingress_rule" "meal_app_alb_ingress_http" {
  description       = "Allow HTTP traffic from the internet"
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
  security_group_id = aws_security_group.meal_app_alb_sg.id
}

resource "aws_vpc_security_group_ingress_rule" "meal_app_alb_ingress_https" {
  description       = "Allow HTTPS traffic from the internet"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
  security_group_id = aws_security_group.meal_app_alb_sg.id
}

resource "aws_vpc_security_group_egress_rule" "meal_app_alb_egress" {
  security_group_id = aws_security_group.meal_app_alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# ── Nginx SG — accepts traffic only from ALB ─────────────────────────────────
resource "aws_security_group" "nginx_sg" {
  name   = "meal-app-nginx-sg"
  vpc_id = var.vpc_id
  tags = {
    Name        = "Meal App Nginx SG",
    Environment = "Production"
  }
}

resource "aws_vpc_security_group_ingress_rule" "nginx_from_alb" {
  security_group_id            = aws_security_group.nginx_sg.id
  referenced_security_group_id = aws_security_group.meal_app_alb_sg.id
  from_port                    = 8084
  to_port                      = 8084
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "nginx_egress" {
  security_group_id = aws_security_group.nginx_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}


# ── Auth service SG — accepts traffic only from Nginx ────────────────────────
resource "aws_security_group" "auth_sg" {
  name   = "meal-app-auth-sg"
  vpc_id = var.vpc_id
  tags = {
    Name        = "Meal App Auth SG",
    Environment = "Production"
  }
}

resource "aws_vpc_security_group_ingress_rule" "auth_from_nginx" {
  security_group_id            = aws_security_group.auth_sg.id
  referenced_security_group_id = aws_security_group.nginx_sg.id
  from_port                    = var.auth_port
  to_port                      = var.auth_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "auth_egress" {
  security_group_id = aws_security_group.auth_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# ── Product service SG — accepts traffic from Nginx only ─────────────────────
resource "aws_security_group" "product_sg" {
  name   = "meal-app-product-sg"
  vpc_id = var.vpc_id
  tags   = { 
    Name = "Meal App Product SG", 
    Environment = "Production" 
  }
}

resource "aws_vpc_security_group_ingress_rule" "product_from_nginx" {
  security_group_id            = aws_security_group.product_sg.id
  referenced_security_group_id = aws_security_group.nginx_sg.id
  from_port                    = var.product_port
  to_port                      = var.product_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "product_egress" {
  security_group_id = aws_security_group.product_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# ── Order service SG — internal only, called by product via SQS ──────────────
resource "aws_security_group" "order_sg" {
  name   = "meal-app-order-sg"
  vpc_id = var.vpc_id
  tags   = { 
    Name = "Meal App Order SG", 
    Environment = "Production" 
  }
}

resource "aws_vpc_security_group_ingress_rule" "order_from_product" {
  security_group_id            = aws_security_group.order_sg.id
  referenced_security_group_id = aws_security_group.product_sg.id
  from_port                    = var.order_port
  to_port                      = var.order_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "order_egress" {
  security_group_id = aws_security_group.order_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# ── Delivery service SG — accepts traffic from Nginx only ────────────────────
resource "aws_security_group" "delivery_sg" {
  name   = "meal-app-delivery-sg"
  vpc_id = var.vpc_id
  tags   = { 
    Name = "Meal App Delivery SG", 
    Environment = "Production" 
  }
}

resource "aws_vpc_security_group_ingress_rule" "delivery_from_nginx" {
  security_group_id            = aws_security_group.delivery_sg.id
  referenced_security_group_id = aws_security_group.nginx_sg.id
  from_port                    = var.delivery_port
  to_port                      = var.delivery_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "delivery_egress" {
  security_group_id = aws_security_group.delivery_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# ── DocumentDB SG — accepts 27017 from all four service SGs ──────────────────
resource "aws_security_group" "docdb_sg" {
  name   = "meal-app-docdb-sg"
  vpc_id = var.vpc_id
  tags   = { Name = "Meal App DocumentDB SG", Environment = "Production" }
}

resource "aws_vpc_security_group_ingress_rule" "docdb_from_auth" {
  security_group_id            = aws_security_group.docdb_sg.id
  referenced_security_group_id = aws_security_group.auth_sg.id
  from_port                    = var.docdb_port
  to_port                      = var.docdb_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "docdb_from_product" {
  security_group_id            = aws_security_group.docdb_sg.id
  referenced_security_group_id = aws_security_group.product_sg.id
  from_port                    = var.docdb_port
  to_port                      = var.docdb_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "docdb_from_order" {
  security_group_id            = aws_security_group.docdb_sg.id
  referenced_security_group_id = aws_security_group.order_sg.id
  from_port                    = var.docdb_port
  to_port                      = var.docdb_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "docdb_from_delivery" {
  security_group_id            = aws_security_group.docdb_sg.id
  referenced_security_group_id = aws_security_group.delivery_sg.id
  from_port                    = var.docdb_port
  to_port                      = var.docdb_port
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "docdb_egress" {
  security_group_id = aws_security_group.docdb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}