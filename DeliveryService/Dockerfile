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
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 9603
CMD [ "node", "app.js" ]