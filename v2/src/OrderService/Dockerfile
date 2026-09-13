FROM node:20-alpine

RUN apk add --no-cache curl

RUN mkdir -p /home/order-service

WORKDIR /home/order-service

ADD package*.json .

RUN npm install

COPY . .

COPY global-bundle.pem /app/certs/global-bundle.pem

EXPOSE 9600

RUN addgroup -S mealapp && adduser -S orderuser -G mealapp

USER orderuser

CMD [ "node", "app.js" ]