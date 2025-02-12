FROM node:20-alpine

WORKDIR /app

COPY ./backend/package*.json /app
RUN npm install
COPY ./backend/src /app

RUN npx prisma migrate dev --name init

EXPOSE 3000

CMD ["node", "app.js"]