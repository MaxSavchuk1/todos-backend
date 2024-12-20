import { Injectable } from '@nestjs/common';
import { ProjectEntity } from './entity/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/project.create-dto';
import { UpdateProjectDto } from './dto/project.update-dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private userRepository: Repository<ProjectEntity>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async create(project: CreateProjectDto) {
    const newProject = this.userRepository.create(project);
    await this.userRepository.save(newProject);
  }

  async update(id: number, project: UpdateProjectDto) {
    await this.userRepository.update(id, project);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
