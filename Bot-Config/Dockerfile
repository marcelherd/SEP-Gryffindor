FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

COPY package.json package-lock.json ./
RUN yarn install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
