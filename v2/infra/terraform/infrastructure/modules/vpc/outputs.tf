output "vpc_id" {
  value = aws_vpc.MealAppVpc.id
}

output "public_subnet_ids" {
  value = [aws_subnet.public.id]
}

output "private_subnet_ids" {
  value = [aws_subnet.private.id]
}

output "db_subnet_ids" {
  value = values(aws_subnet.db_private)[*].id
}