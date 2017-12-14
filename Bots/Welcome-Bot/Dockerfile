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

# Bundle app source
COPY . .

EXPOSE 3030

ENV NODE_ENV=platzhalter
ENV NODE_ENV_USER=user
HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \
 CMD ["npm", "test"]

CMD [ "npm", "start" ]


