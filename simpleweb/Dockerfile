# Base image
FROM node:14-alpine

WORKDIR /usr/app

# Dependencies
COPY ./ ./
RUN npm install

# Default command
CMD ["npm", "start"]


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
