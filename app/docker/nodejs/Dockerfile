FROM node:18.10.0-alpine3.16

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

EXPOSE 3000

# CMD [ "npm", "run", "start" ]