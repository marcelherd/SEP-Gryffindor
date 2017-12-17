FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install && apk --no-cache add curl

## Add Healthcheck
HEALTHCHECK --interval=15s --timeout=20s --start-period=30s --retries=3 CMD curl -get http://localhost:3000/health || exit 500

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
