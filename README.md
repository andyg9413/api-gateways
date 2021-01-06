<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

This project is managing gateways - master devices that control multiple peripheral devices.

## Requirements

- TypeScript 3.9+
- Node 12.0+
- Docker 1.25.0
- MongoDB (You may use the provided docker-compose file)

## Project configuration
Start by cloning this project on your workstation.

```bash
$ git clone https://github.com/andyg9413/api-gateways
```
The next thing will be to install all the dependencies of the project.
```bash
$ cd ./api-gateways
$ yarn install
```
Once the dependencies are installed, you can now configure your project by creating a new .env file containing your environment variables used for development.

```bash
$ touch .env
```
These are the environment variables you will need
```bash
MONGO_URI
```
Once you set the environment variables run the docker-compose file in the console in order the run MongoDB
```bash
$ docker-compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
