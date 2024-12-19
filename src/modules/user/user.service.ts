import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/user.create-dto';
import { UpdateUserDto } from './dto/user.update-dto';
import { FindDto } from 'src/utils/find.dto';
import { Role } from 'src/modules/role/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto) {
    const user = this.userRepository.create(userDto);
    // ...
    await this.userRepository.save(user);
  }

  async me({ id }): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.todos', 'todo', 'todo.parentId IS NULL')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findAll(findDto: FindDto) {
    const [results, count] = await this.userRepository.findAndCount({
      skip: findDto.offset,
      take: findDto.limit === -1 ? undefined : findDto.limit,
      order: {
        id: 'ASC',
      },
    });

    return {
      results,
      total: count,
    };
  }

  async update(id: number, data: UpdateUserDto, currentUser: UserEntity) {
    if (
      currentUser.id !== id &&
      !(
        currentUser.roles.includes(Role.USER_MANAGER) ||
        currentUser.roles.includes(Role.ADMIN)
      )
    ) {
      throw new ForbiddenException(
        'Only admins and user managers can update other users',
      );
    }

    await this.userRepository.update(id, data);
  }

  async remove(id: number, currentUser: UserEntity) {
    if (currentUser.id === id) {
      throw new ForbiddenException('Cannot delete yourself!');
    }
    const user = await this.userRepository.findOneBy({ id });
    if (
      user.roles.includes(Role.ADMIN) &&
      !currentUser.roles.includes(Role.ADMIN)
    ) {
      throw new ForbiddenException('Only admins can delete admins!');
    }

    return await this.userRepository.delete(id);
  }
}
