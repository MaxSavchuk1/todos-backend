import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { IsExist } from '../utils/validators/is-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { CheckAdminCount } from './validators/check-admin-count.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [RoleController],
  providers: [RoleService, IsExist, CheckAdminCount],
  exports: [RoleService],
})
export class RoleModule {}
