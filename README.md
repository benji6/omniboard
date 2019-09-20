# Omniboard

[![Netlify Status](https://api.netlify.com/api/v1/badges/330b50a1-8198-495f-91f2-b8d2cee0f916/deploy-status)](https://app.netlify.com/sites/omniboard/deploys)

## Getting started

- Run the backend with `docker-compose up`
- Run the frontend with `cd client && yarn && yarn start`

## Building for production

To build the backend run `docker build api`

You can run the built image with `docker run -d -p 127.0.0.1:4000:4000 IMAGE`

## Deploying

### Infrastructure

```sh
cd terraform
terraform apply
```

### UI

Master is automatically deployed with [Netlify](http://netlify.com).
