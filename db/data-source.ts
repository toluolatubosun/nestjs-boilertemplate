import { CONFIGS } from "../configs";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",

    host: CONFIGS.POSTGRES.HOST,
    port: CONFIGS.POSTGRES.PORT,
    schema: CONFIGS.POSTGRES.SCHEMA,
    database: CONFIGS.POSTGRES.DATABASE,
    username: CONFIGS.POSTGRES.USERNAME,
    password: CONFIGS.POSTGRES.PASSWORD,

    synchronize: false,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/db/migrations/*{.ts,.js}"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
