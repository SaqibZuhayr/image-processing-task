FROM node:18.3-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8081

CMD ["npm", "run" , "start"]
