resource "aws_ecs_cluster" "meal-app-ecs-cluster" {
  name = "meal-app-ecs-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  tags = {
    Name        = "meal-app-ecs-cluster"
    Environment = "Production"
  }
}

resource "aws_ecs_cluster_capacity_providers" "meal-app-ecs-capacity-provider"{
    cluster_name = aws_ecs_cluster.meal-app-ecs-cluster.name
    capacity_providers = ["FARGATE"]

    default_capacity_provider_strategy{
        base = 1
        weight = 1
        capacity_provider = "FARGATE"
    }

}

resource "aws_ecs_task_definition" "meal_app_auth_service_task" {
    family                   = "meal_app_auth_service_task"
    container_definitions = file("${path.module}/auth.json")
    execution_role_arn = var.ecs_task_execution_role_arn

}

resource "aws_ecs_task_definition" "meal_app_product_service_task" {
    family                   = "meal_app_product_service_task"
    container_definitions = file("${path.module}/product.json")
    execution_role_arn = var.ecs_task_execution_role_arn
}

resource "aws_ecs_task_definition" "meal_app_delivery_service_task" {
    family                   = "meal_app_delivery_service_task"
    container_definitions = file("${path.module}/delivery.json")
    execution_role_arn = var.ecs_task_execution_role_arn
}

resource "aws_ecs_task_definition" "meal_app_order_service_task" {
    family                   = "meal_app_order_service_task"
    container_definitions = file("${path.module}/order.json")
    execution_role_arn = var.ecs_task_execution_role_arn
}


resource "aws_service_discovery_private_dns_namespace" "mealapp" {
  name = "mealapp.local"

  vpc = var.vpc_id

  tags = {
    Project = "meal-app"
  }
}

resource "aws_service_discovery_service" "auth" {
  name = "auth"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.mealapp.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_custom_config {}
}

resource "aws_service_discovery_service" "product" {
  name = "product"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.mealapp.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_custom_config {
  }
}

resource "aws_service_discovery_service" "order" {
  name = "order"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.mealapp.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_custom_config {}
}

resource "aws_service_discovery_service" "delivery" {
  name = "delivery"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.mealapp.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_custom_config {
  }
}

resource "aws_ecs_service" "user_auth" {
  name            = "user-auth"
  cluster         = aws_ecs_cluster.meal-app-ecs-cluster.id
  task_definition = aws_ecs_task_definition.meal_app_auth_service_task.arn
  desired_count   = 1

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  service_registries {
    registry_arn = aws_service_discovery_service.auth.arn
  }
}