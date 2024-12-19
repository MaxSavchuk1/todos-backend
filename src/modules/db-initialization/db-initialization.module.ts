import { Module } from '@nestjs/common';
import { DbInitializationService } from './db-initialization.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  providers: [DbInitializationService],
})
export class DbInitializationModule {}
