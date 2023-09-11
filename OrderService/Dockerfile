FROM node:20-alpine

ENV MONGO_DB_USERNAME=root\
    MONGO_DB_PASSWORD=example

RUN mkdir -p /home/orderService

COPY . /home/orderService

WORKDIR /home/orderService

RUN npm install

EXPOSE 9600

CMD [ "node", "app.js" ]