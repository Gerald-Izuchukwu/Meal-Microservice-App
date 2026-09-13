resource "aws_docdb_cluster" "meal_app_cluster" {
  cluster_identifier = "meal-app-cluster"
  availability_zones = [ "us-east-1a", "us-east-1b" ]
  master_password = var.doc_db_password
  master_username = var.cluster_master_username
  skip_final_snapshot = true
  port = var.cluster_port
}

resource "aws_docdb_cluster_instance" "meal_app_cluster_instance" {
  cluster_identifier = aws_docdb_cluster.meal_app_cluster.id
  identifier = "meal-app-cluster-instance"
  instance_class = "db.t3.medium"
}

