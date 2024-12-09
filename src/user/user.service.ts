import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/user.create-dto';
import { UpdateUserDto } from './dto/user.update-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto) {
    const user = this.userRepository.create(userDto);
    // ...
    return await this.userRepository.save(user);
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        todos: true,
      },
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, data: UpdateUserDto) {
    return this.userRepository.update(id, data);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
