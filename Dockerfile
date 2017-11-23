FROM node:alpine

WORKDIR /usr/src
COPY Bots .
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY /Bot-Marketplace/package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./
#RUN apk --no-cache add curl 
#RUN apt-get install -y nodejs 
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY /Bot-Marketplace .

EXPOSE 8080
CMD [ "npm", "start" ]
