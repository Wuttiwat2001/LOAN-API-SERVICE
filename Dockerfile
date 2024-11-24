FROM node:18

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 8080

CMD ["node", "src/index.js"]