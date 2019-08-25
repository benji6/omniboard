FROM node:10-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
ENV NODE_ENV production
RUN yarn
COPY src src
USER node
ENTRYPOINT ["node", "src"]
