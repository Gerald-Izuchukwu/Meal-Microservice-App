output "ecs_security_group_id" {
  value = aws_security_group.meal_app_ecs_sg.id
}
output "docdb_sg_id" {
  value = aws_security_group.meal_app_db_sg.id
}