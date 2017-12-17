FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install apk add --no-cache curl

## Add Healthcheck
HEALTHCHECK --start-period=10s --interval=3s --timeout=10s --retries=3 CMD curl -get http://localhost:5000 || exit 500
# Bundle app source
COPY . .

EXPOSE 8070

ENV NODE_ENV_CONFIG=config
ENV NODE_ENV_ENDPOINT=endpoint
ENV NODE_ENV_USER=user
ENV NODE_ENV_HOST=ip

CMD [ "npm", "start" ]

