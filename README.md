# NestJS Boilertemplate

## Description

This is a template for a NestJS GraphQL project.

## Installation

```bash
$ npm install
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
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

