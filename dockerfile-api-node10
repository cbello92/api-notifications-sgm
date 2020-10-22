#dockerfile for production
#FROM node:10.20.1-stretch
FROM node:10.21.0-stretch-slim
# Create app directory
WORKDIR /api
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available ( npm@5 +)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production # Bundle app source
COPY . .
EXPOSE 5001
CMD [ "node" , "server.js" ]