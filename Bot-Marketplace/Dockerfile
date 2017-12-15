FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
#COPY package.json package-lock.json ./
RUN npm install

# Add Curl for Healthcheck
RUN apk --no-cache add curl
## Add Healthcheck
HEALTHCHECK --interval=3s --timeout=3s --start-period=10s --retries=3 CMD curl -get http://localhost:4000/api/v1/discover || exit 500
# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "npm", "start" ]
