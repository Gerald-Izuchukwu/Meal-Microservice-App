resource "aws_iam_user" "MealAppUser" {
    name = "meal-app-user"
    path = "/"
    tags = {
        Environment = "Production"
        Project     = "MealApp"
    }


}

resource "aws_iam_access_key" "MealAppUserAccessKey" {
    user = aws_iam_user.MealAppUser.name
}


resource "aws_iam_user_policy_attachment" "MealAppUserPolicy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonECS_FullAccess",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess",
    "arn:aws:iam::aws:policy/AmazonDocDBFullAccess",
    "arn:aws:iam::aws:policy/AmazonSQSFullAccess",
    "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
  ])

  user       = aws_iam_user.MealAppUser.name
  policy_arn = each.value
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs_task_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "read_ecs_secret"{
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}