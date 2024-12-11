import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { IsExist } from '../utils/validators/is-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, IsExist, IsNotExist],
  exports: [UserService],
})
export class UserModule {}
