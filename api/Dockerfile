FROM node:10-slim as deps
COPY package.json yarn.lock ./
ENV NODE_ENV=production
RUN yarn

FROM node:10-slim as build
COPY package.json yarn.lock ./
RUN yarn
COPY src src
COPY tsconfig.json ./
RUN yarn build

FROM node:10-slim
WORKDIR /srv/omniboard
COPY .env .env
COPY --from=deps node_modules node_modules
COPY --from=build build build
ENV NODE_ENV=production
USER node
ENTRYPOINT ["node", "build"]
