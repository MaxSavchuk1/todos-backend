## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
#init db
CREATE DATABASE todos;

# development
$ npm run start

# create admin (need first run 'npm run start')
$ npm run db-init

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
