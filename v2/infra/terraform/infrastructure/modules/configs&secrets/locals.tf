locals {

  # ---------------------------------------------------------
  # SHARED PARAMETERS
  # ---------------------------------------------------------

  general_parameters = {

    RABBITMQ_CONNECTION_STRING = var.rabbitmq_connection_string
    RABBITMQ_DEFAULT_USER      = var.rabbitmq_default_user
    RABBITMQ_DEFAULT_PASS      = var.rabbitmq_default_pass
    RABBITMQ_DEFAULT_HOST      = var.rabbitmq_default_host
    RABBITMQ_DEFAULT_PORT      = var.rabbitmq_default_port

    MONGO_DB_USERNAME          = var.mongo_db_username
    MONGO_DB_HOST              = var.mongo_db_host
    MONGO_DB_PASSWORD          = var.doc_db_password

    DB_POST_MESSAGE            = var.db_post_message

    JWT_ACCESS_TOKEN_SECRET    = var.jwt_access_token_secret
    JWT_REFRESH_TOKEN          = var.jwt_refresh_token
  }


  # ---------------------------------------------------------
  # AUTH
  # ---------------------------------------------------------

  auth_parameters = merge(
    local.general_parameters,
    {
      PORT                 = var.auth_port
      AUTH_HOST            = var.auth_host
      MONGO_DB_NAME        = var.auth_db_name

      AWS_SecretAccessKey  = var.aws_secret_access_key
      AWS_SecretAccessKeyId = var.aws_secret_access_key_id
      AWS_Region           = var.aws_region

      GMAIL_PASS           = var.gmail_pass
      GMAIL_USER           = var.gmail_user
    }
  )


  # ---------------------------------------------------------
  # PRODUCT
  # ---------------------------------------------------------

  product_parameters = merge(
    local.general_parameters,
    {
      PORT                  = var.product_port
      PRODUCT_HOST          = var.product_host
      MONGO_DB_NAME         = var.product_db_name

      ORDER_SERVICE_PORT    = var.order_port
      ORDER_SERVICE_HOST    = var.order_host

      DELIVERY_SERVICE_PORT = var.delivery_port
      DELIVERY_SERVICE_HOST = var.delivery_host

      AUTH_SERVICE_HOST     = var.auth_host
      AUTH_SERVICE_PORT     = var.auth_port
    }
  )


  # ---------------------------------------------------------
  # ORDER
  # ---------------------------------------------------------

  order_parameters = merge(
    local.general_parameters,
    {
      PORT                  = var.order_port
      ORDER_SERVICE_HOST    = var.order_host
      MONGO_DB_NAME         = var.order_db_name

      PRODUCT_SERVICE_PORT  = var.product_port
      PRODUCT_SERVICE_HOST  = var.product_host

      DELIVERY_SERVICE_PORT = var.delivery_port
      DELIVERY_SERVICE_HOST = var.delivery_host

      AUTH_SERVICE_HOST     = var.auth_host
      AUTH_SERVICE_PORT     = var.auth_port
    }
  )


  # ---------------------------------------------------------
  # DELIVERY
  # ---------------------------------------------------------

  delivery_parameters = merge(
    local.general_parameters,
    {
      PORT                  = var.delivery_port
      DELIVERY_SERVICE_HOST = var.delivery_host
      MONGO_DB_NAME         = var.delivery_db_name

      ORDER_SERVICE_PORT    = var.order_port
      ORDER_SERVICE_HOST    = var.order_host

      PRODUCT_SERVICE_PORT  = var.product_port
      PRODUCT_SERVICE_HOST  = var.product_host

      AUTH_SERVICE_HOST     = var.auth_host
      AUTH_SERVICE_PORT     = var.auth_port
    }
  )
}