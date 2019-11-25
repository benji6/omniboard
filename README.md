# Omniboard

Unfinished and abandoned community board app - left here for posterity.

## Getting started

- Run the tests with `./test.sh`
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

### Backend

Right now only Cognito is in terraform, the rest of the backend must be deployed manually.

### UI

Master was automatically deployed with [Netlify](http://netlify.com).
