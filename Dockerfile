FROM node:9.11.1-alpine

RUN mkdir /app

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./yarn.lock /app

COPY ./internals /app/internals

RUN ls /app

RUN yarn

COPY ./app /app/app

RUN yarn build

FROM nginx:alpine
#COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html