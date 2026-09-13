# FROM node:20-alpine

# RUN mkdir -p /home/delivery-service

# COPY . /home/delivery-service

# WORKDIR /home/delivery-service

# RUN npm install

# EXPOSE 9603

# CMD [ "node", "app.js"]

FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

FROM node:20-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
COPY global-bundle.pem /app/certs/global-bundle.pem
EXPOSE 9603
RUN addgroup -S mealapp && adduser -S deliveryuser -G mealapp
USER deliveryuser
CMD [ "node", "app.js" ]

#next add a line thar creates a user that will run the app, and then change the user to that user. This is a security best practice to avoid running the app as root.