import { DataSource } from 'typeorm';
import { ormConfig } from 'src/config/ormConfig';
import { CONSTANTS_REPOSITORY } from './../constants/repository';

export const databaseProvider = {
  provide: CONSTANTS_REPOSITORY.DATA_SOURCE,
  useFactory: async () => {
    const dataSource = new DataSource(ormConfig);
    return dataSource.initialize();
  },
};