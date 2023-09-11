FROM node:20-alpine

ENV MONGO_DB_USERNAME=root\
    MONGO_DB_PASSWORD=example

RUN mkdir -p /home/product-service

COPY . /home/product-service

WORKDIR /home/product-service

RUN npm install

EXPOSE 9601

CMD [ "node", "app.js"]