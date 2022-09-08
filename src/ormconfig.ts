import { ConnectionOptions } from "typeorm";


const db_logging = process.env["DATABASE_LOGGING"] === "true";

const config: ConnectionOptions = {
  name: "default",
  type: "postgres",
  url: process.env["DATABASE_CONNECTION_STRING"],
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*{.ts,.js}"],
  migrationsTableName: "migrations",
  migrationsRun: false,
  synchronize: false,
  logging: db_logging,
  cli: {
    migrationsDir: "src/migrations/",
  },
};

export = config;
