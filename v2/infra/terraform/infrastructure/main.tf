module "configs_and_secrets" {
  source                  = "./modules/configs&secrets"
  doc_db_password         = var.doc_db_password
  jwt_access_token_secret = var.jwt_access_token_secret
  jwt_refresh_token       = var.jwt_refresh_token
  rabbitmq_connection_string = var.rabbitmq_connection_string
  rabbitmq_default_user      = var.rabbitmq_default_user
  rabbitmq_default_pass      = var.rabbitmq_default_pass
  rabbitmq_default_host      = var.rabbitmq_default_host
  rabbitmq_default_port      = var.rabbitmq_default_port
  mongo_db_username          = var.mongo_db_username
  mongo_db_host              = var.mongo_db_host
  db_post_message            = var.db_post_message
  auth_port                  = var.auth_port
  gmail_pass                 = var.gmail_pass
  aws_secret_access_key      = var.aws_secret_access_key
  aws_secret_access_key_id   = var.aws_secret_access_key_id
  auth_db_name               = var.auth_db_name
  auth_host                  = var.auth_host
  product_port               = var.product_port
  product_db_name            = var.product_db_name
  product_host               = var.product_host
  order_port                 = var.order_port
  order_host                 = var.order_host
  order_db_name              = var.order_db_name
  delivery_port              = var.delivery_port
  delivery_db_name           = var.delivery_db_name
  delivery_host              = var.delivery_host
  aws_region              = var.aws_region
  gmail_user              = var.gmail_user

}

module "vpc" {
  source = "./modules/vpc"
}

module "security_groups" {
  source = "./modules/security_groups"
  vpc_id = module.vpc.vpc_id
  # ecs_ip = module.compute.ecs_ip

}

module "iam" {
  source = "./modules/iam"
}

module "documentdb" {
  source                  = "./modules/documentDB"
  doc_db_password         = var.doc_db_password
  cluster_master_username = var.cluster_master_username
  cluster_port            = var.cluster_port
}

module "compute" {
  source = "./modules/compute"
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  ecs_security_group_id = module.security_groups.ecs_security_group_id
}