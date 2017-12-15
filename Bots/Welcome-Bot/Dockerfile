FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
#COPY package.json package-lock.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production
RUN apk add --no-cache curl
# Bundle app source
COPY . .
HEALTHCHECK --interval=5s --timeout=10s --start-period=20s --retries=3 CMD curl -get http://localhost:5000|| exit 1
EXPOSE 8080

ENV NODE_ENV=platzhalter
ENV NODE_ENV_USER=user

CMD [ "npm", "start" ]

