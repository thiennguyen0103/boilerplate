import { Module } from '@nestjs/common';

import { TypeOrmDatabaseModule } from './typeorm/typeorm.module';

@Module({
  imports: [TypeOrmDatabaseModule],
  exports: [TypeOrmDatabaseModule],
})
export class DatabaseModule {}
