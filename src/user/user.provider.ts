import { DataSource } from "typeorm";
import { User } from "./user.entity";
import { CONSTANTS_REPOSITORY } from './../constants/repository';

export const userProvider = {
    provide: CONSTANTS_REPOSITORY.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [CONSTANTS_REPOSITORY.DATA_SOURCE]
}