FROM node:18-alpine

RUN apk add --no-cache curl

RUN mkdir -p /home/product-service

WORKDIR /home/product-service

ADD package*.json .

RUN npm install

COPY . .

COPY global-bundle.pem /app/certs/global-bundle.pem

EXPOSE 9601

RUN addgroup -S mealapp && adduser -S productuser -G mealapp

USER productuser

CMD [ "node", "app.js"]

