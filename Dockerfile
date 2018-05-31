FROM node:9.11.1-alpine

RUN mkdir /app

WORKDIR /app

COPY ./package.json /app
COPY ./yarn.lock /app

RUN ls /app

RUN yarn

COPY ./src /app/src
COPY ./public /app/public
COPY .env /app

RUN yarn build
