FROM node:6

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV NPM_CONFIG_PRODUCTION=false

EXPOSE 8000

COPY . /srv/app
WORKDIR /srv/app

RUN npm install && ./node_modules/.bin/gulp build && npm install --production

ENTRYPOINT node server.js
