import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './../config/ormConfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig),],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}