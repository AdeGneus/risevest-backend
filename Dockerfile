FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

RUN yarn install --production

EXPOSE 8123

ENV NODE_ENV=production

CMD ["yarn", "start"]
