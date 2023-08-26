FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --verbose

RUN npm run build --verbose

EXPOSE 3000

CMD [ "npm", "start" ]