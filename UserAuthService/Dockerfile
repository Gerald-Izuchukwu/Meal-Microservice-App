FROM node:20-alpine

ENV MONGO_DB_USERNAME=root\
    MONGO_DB_PASSWORD=example

RUN mkdir -p /home/user-auth-service

COPY . /home/user-auth-service

WORKDIR /home/user-auth-service

RUN npm install

EXPOSE 9602

CMD [ "node", "app.js"]