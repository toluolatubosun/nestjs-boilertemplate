# NestJS Boilertemplate

## Description

This is a template for a NestJS GraphQL project.

## Installation

```bash
$ yarn install
```

## Provision resources for development

A `docker-compose.yml` file is provided to provision a PostgreSQL database, SMTP server and a Redis server for development.

```bash
# start the services
$ docker-compose up -d

# stop the services
$ docker-compose down
```

## Migrations

<b>Database Synchronization is disabled in favour of Migrations</b>

```bash
# generate new migration
yarn migration:generate -- db/migrations/NewMigration

# run migration
yarn migration:run
```

<b>NOTE: Make sure to run the migration before starting the app. In production the run migration command is added to the build script.</b>

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

