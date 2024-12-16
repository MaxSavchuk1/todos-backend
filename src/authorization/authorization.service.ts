import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { omit } from 'lodash';
import { UserEntity } from 'src/user/entity/user.entity';
import { UpdateRolesDto } from './dto/roles.update-dto';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async update(data: UpdateRolesDto) {
    await this.userRepository.update(data.id, omit(data, 'id'));
  }
}
