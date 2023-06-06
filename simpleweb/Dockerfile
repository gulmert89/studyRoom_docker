# Specify a base image
FROM node:14-alpine

# It the folder doesn't exist on the directory, it will be created automatically.
WORKDIR /usr/app

# Install some dependencies
COPY ./package.json  ./
RUN npm install
RUN npm install -g tree-cli
RUN npm install -g tiny-cli-editor

# We split this COPY not to install all the dependencies unless they are changed.
COPY ./  ./

# Default command
CMD ["npm", "start"]