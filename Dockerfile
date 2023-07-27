FROM node:16.0.0-alpine
RUN apk add alpine-sdk

WORKDIR /home/node/app
COPY package.json .
RUN npm install --only=prod && npm cache clean --force --loglevel=error
COPY . .

CMD ["npm", "start"]