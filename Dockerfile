FROM node:alpine

WORKDIR /app

COPY package*.json ./

ENV HUSKY=0

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]