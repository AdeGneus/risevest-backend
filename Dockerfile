FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

RUN yarn build

EXPOSE 8123

ENV NODE_ENV=production

CMD ["yarn", "start"]
