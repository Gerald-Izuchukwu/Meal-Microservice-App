# Food-Ecommerce CRUD APP - Version 1.0

This is a simple Food-Ecommerce CRUD app built with microservice architecture. It currently includes User Authentication (UserAuth MS), Product Management (Product MS), Order Management (Order MS), and plans for a Delivery Agent service in later versions.

## Getting Started

1. Fork and Clone the Repository:
    ```bash
    git clone https://github.com/Gerald-Izuchukwu/Meal-Microservice-App.git

2. Change into four microservice folders and install dependencies:
   ```bash
   cd Meal-Microservice-App/UserAuthService
   npm install

   cd Meal-Microservice-App/ProductService
   npm install

   cd Meal-Microservice-App/OrderService
   npm install
   
   cd Meal-Microservice-App/DeliveryService
   npm install

5. Start your mongodb and rabbitmq container:
    ```bash
    docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS='-rabbit loopback_users []' rabbitmq:3.9-rc-management

    docker run -p 27017:27017 --name mongodb-container -d mongo:latest

5. Since each service will require it's own set of envvars, create a configuration file in each microservice folder and populate it with the values of the following envvars. 
* For UserAuthService:
    ```bash
    PORT, MONGO_URI, RABBITMQ_CONNECTION_STRING, RABBITMQ_DEFAULT_USER, RABBITMQ_DEFAULT_PASS, RABBITMQ_DEFAULT_HOST, RABBITMQ_DEFAULT_PORT, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN, AWS_SecretAccessKey, AWS_AccessKeyID, AWS_Region, GMAIL_PASS, GMAIL_USER

GMAIL_PASS and GMAIL_USER is for sending emails, if you dont want to use Amazon SES. 

* For Product Service:
    ```bash
    PORT, MONGO_URI, JWTSECRET, RABBITMQ_CONNECTION_STRING, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, RABBITMQ_DEFAULT_USER,RABBITMQ_DEFAULT_PASS, RABBITMQ_DEFAULT_HOST, RABBITMQ_DEFAULT_PORT, ORDER_SERVICE_HOST, ORDER_SERVICE_PORT

* For Order Service:
    ```bash
    PORT, MONGO_URI, JWTSECRET, RABBITMQ_CONNECTION_STRING, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, RABBITMQ_DEFAULT_USER,RABBITMQ_DEFAULT_PASS, RABBITMQ_DEFAULT_HOST, RABBITMQ_DEFAULT_PORT, DELIVERY_SERVICE_HOST, DELIVERY_SERVICE_PORT

* For Delivery Service:
    ```bash
    PORT, MONGO_URI, JWTSECRET, RABBITMQ_CONNECTION_STRING, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, RABBITMQ_DEFAULT_USER,RABBITMQ_DEFAULT_PASS, RABBITMQ_DEFAULT_HOST, RABBITMQ_DEFAULT_PORT

6. Start the Service
The service can be started using nodemon or node. For each of the microservice, run:
    ```bash
    npm run start 
    OR
    npm run dev

### Routes

