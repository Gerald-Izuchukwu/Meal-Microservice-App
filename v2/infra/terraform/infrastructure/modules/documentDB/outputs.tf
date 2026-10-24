# What your services put in MONGO_DB_HOST
output "docdb_cluster_endpoint" {
  value = aws_docdb_cluster.meal_app_cluster.endpoint
}
# Confirm the port your connection string uses
output "docdb_port" {
  value = aws_docdb_cluster.meal_app_cluster.port
}

# Useful for scoping IAM or SG rules by resource ID
output "docdb_cluster_resource_id" {
  value = aws_docdb_cluster.meal_app_cluster.cluster_resource_id
}

# Needed if you ever enable CloudWatch log exports
output "docdb_cluster_arn" {
  value = aws_docdb_cluster.meal_app_cluster.arn
}