import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../role/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class DbInitializationService {
  private readonly logger = new Logger(DbInitializationService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async dbInit() {
    await this.fillInUsers();
    this.logger.debug('Users filled in successfully');
  }

  private async fillInUsers() {
    const user = this.userRepository.create({
      email: 'admin@admin.com',
      password: '123456',
      firstName: 'Admin',
      lastName: 'Admin',
      roles: [Role.ADMIN],
    });
    await this.userRepository.save(user);
  }
}
