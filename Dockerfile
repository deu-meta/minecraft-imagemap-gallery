FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./src

RUN yarn install
RUN yarn build

COPY public ./public

EXPOSE 3111

CMD ["node", "./dist/app.js"]