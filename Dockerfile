
FROM node:16.14 As development

RUN npm i -g @angular/cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .