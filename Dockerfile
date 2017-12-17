FROM node:alpine

WORKDIR /usr/src/ 
COPY Bots Bots 
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY Bot-Marketplace/package.json Bot-Marketplace/package-lock.json ./
RUN yarn install && apk --no-cache add curl
# Add Curl for Healthcheck
RUN apk --no-cache add curl 
## Add Healthcheck
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 CMD curl -get http://localhost:4000/api/v1/discover || exit 500

# Bundle app source
COPY /Bot-Marketplace .

EXPOSE 4000
CMD [ "npm", "start" ]
