FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install apk add --no-cache curl

## Add Healthcheck
HEALTHCHECK --interval=3s --timeout=3s --start-period=10s --retries=3 CMD curl -get http://localhost:5000|| exit 500
# Bundle app source
COPY . .

EXPOSE 8080

ENV NODE_ENV_CONFIG=platzhalter
ENV NODE_ENV_ENDPOINT=platzhalter
ENV NODE_ENV_USER=user

CMD [ "npm", "start" ]

