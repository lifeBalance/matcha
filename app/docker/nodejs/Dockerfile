FROM node:18.10.0-alpine3.16

RUN apk add --no-cache tzdata

ENV TZ='Europe/Helsinki'

WORKDIR /app

COPY ./package*.json /app/

RUN npm install --global knex && npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
# CMD [ "npm", "run", "start" ]
# CMD [ "node", "./index.js" ]