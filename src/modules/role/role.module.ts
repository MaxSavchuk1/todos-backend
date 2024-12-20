import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { CheckAdminCount } from './validators/check-admin-count.validator';
import { CheckUserRole } from './validators/check-user-role';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [RoleController],
  providers: [RoleService, IsExist, CheckAdminCount, CheckUserRole],
  exports: [RoleService],
})
export class RoleModule {}
