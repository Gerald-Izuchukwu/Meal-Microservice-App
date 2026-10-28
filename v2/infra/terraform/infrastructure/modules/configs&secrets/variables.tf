# general
variable "doc_db_password" { sensitive = true }
variable "jwt_access_token_secret" { sensitive = true }
variable "jwt_refresh_token" { sensitive = true }
variable "rabbitmq_connection_string" {}
variable "rabbitmq_default_user" {}
variable "rabbitmq_default_pass" { sensitive = true }
variable "rabbitmq_default_host" {}
variable "rabbitmq_default_port" {}
variable "mongo_db_username" {}
variable "mongo_db_host" {}
variable "db_post_message" {}

#auth
variable "auth_port" {}
variable "gmail_pass" { sensitive = true }
variable "aws_secret_access_key" { sensitive = true }
variable "aws_region" {}
variable "gmail_user" {}
variable "auth_db_name" {}
variable "auth_host" {}
variable "aws_secret_access_key_id" { sensitive = true }

# product
variable "product_port" {}
variable "product_db_name" {}
variable "product_host" {}

# order
variable "order_port" {}
variable "order_host" {}
variable "order_db_name" {}

# delivery
variable "delivery_port" {}
variable "delivery_db_name" {}
variable "delivery_host" {}




    