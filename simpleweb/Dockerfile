# Base image
FROM node:14-alpine

# Working directory in the container
WORKDIR /usr/app

# Dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Default command
CMD ["npm", "start"]


### Version 4 ###
# FROM node:14-alpine
# WORKDIR /usr/app
# COPY ./ ./
# RUN npm install
# CMD ["npm", "start"]

### Version 3 ###
# FROM node:14-alpine
# COPY ./ ./
# RUN npm install
# CMD ["npm", "start"]

### Version 2 ###
# FROM node:14-alpine
# RUN npm install
# CMD ["npm", "start"]


### Version 1 ###
# FROM alpine
# RUN npm install
# CMD ["npm", "start"]
