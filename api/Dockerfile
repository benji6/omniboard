FROM node:10-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY src src
USER node
ENTRYPOINT ["node", "src"]
