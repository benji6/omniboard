FROM node:10-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
ARG node_env=production
ENV NODE_ENV=$node_env
RUN yarn
COPY src src
USER node
ENTRYPOINT ["node", "src"]
