import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({path: `.env.${process.env.NODE_ENV}`})

import { User } from './../user/user.entity';

export const ormConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT)|| 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        User
    ],
    synchronize: true,
 //   logging: true
}