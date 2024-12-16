import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { IsExist } from '../utils/validators/is-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { CheckAdminCount } from './validators/check-admin-count.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, IsExist, CheckAdminCount],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
