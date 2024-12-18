import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { AddRoleDto } from './dto/role.add-dto';
import { RemoveRoleDto } from './dto/role.remove-dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async add({ userId, role }: AddRoleDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const updatedRoles = [...new Set([...user.roles, role])];
    await this.userRepository.update(userId, { roles: updatedRoles });
  }

  async remove({ userId, role }: RemoveRoleDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const updatedRoles = user.roles.filter((r) => r !== role);
    if (!updatedRoles.length) {
      throw new UnprocessableEntityException('At least one role must exist!');
    }
    await this.userRepository.update(userId, { roles: updatedRoles });
  }
}
