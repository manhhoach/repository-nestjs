import {DataSourceOptions} from 'typeorm';
import { User } from './../user/user.entity';


export const ormConfig: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'manh123456',
    database: 'test',
    entities: [
        User
    ],
    synchronize: true
}