FROM node:16 AS development

ENV NODE_ENV=development

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]