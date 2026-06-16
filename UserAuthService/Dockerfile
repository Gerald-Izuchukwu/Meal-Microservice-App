# FROM node:18-alpine

# RUN mkdir -p /home/user-auth-service

# COPY . /home/user-auth-service

# WORKDIR /home/user-auth-service

# RUN npm install

# EXPOSE 9602

# CMD [ "node", "app.js"]


FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force


FROM node:18-alpine 
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 9602
CMD [ "node", "app.js" ]