import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { omit } from 'lodash';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/todo.create-dto';
import { UpdateTodoDto } from './dto/todo.update-dto';

const STATUSES = ['new', 'in process', 'testing', 'done']; // TODO: move to constants

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll(): Promise<TodoEntity[]> {
    return this.todoRepository.find();
  }

  async findRootTodos(): Promise<TodoEntity[]> {
    return this.todoRepository.find({
      where: { parentId: IsNull() },
    });
  }

  async findTodoById(id: number): Promise<TodoEntity> {
    return await this.todoRepository.findOne({
      where: { id },
    });
  }

  async findTodoByIdWithChildren(id: number): Promise<TodoEntity> {
    const selectedTodo: TodoEntity = await this.findTodoById(id);
    if (!selectedTodo)
      throw new NotFoundException(`there is no todo with ID ${id}`);

    if (selectedTodo.children.length) {
      selectedTodo.children = (
        await Promise.all(
          selectedTodo.children.map(async (childId: any) => {
            const foundTodo = await this.todoRepository.findOne({
              where: { id: childId },
            });
            if (!foundTodo) {
              await this.removeChildTodo(selectedTodo, childId);
            }
            return foundTodo;
          }),
        )
      ).filter((todo) => !!todo);
    }
    return selectedTodo;
  }

  async createTodo(data: CreateTodoDto): Promise<TodoEntity> {
    if (!data.title)
      throw new UnprocessableEntityException('Title is required');

    const savedTodo = await this.todoRepository.save(data);

    if (data.parentId) {
      const parent = await this.todoRepository.findOne({
        where: { id: data.parentId },
      });
      if (parent) {
        await this.todoRepository.update(data.parentId, {
          children: [...parent.children, savedTodo.id],
        });
      }
    }

    return savedTodo;
  }

  async updateTodo(id: number, data: UpdateTodoDto): Promise<void> {
    if (data.status && !STATUSES.includes(data.status))
      throw new UnprocessableEntityException(
        `Invalid status. Available: ${STATUSES.join(', ')}`,
      );

    await this.todoRepository.update(id, data);
  }

  async removeTodoById(todoId: number): Promise<void> {
    const selectedTodo: TodoEntity = await this.findTodoById(todoId);
    if (!selectedTodo)
      throw new NotFoundException(`there is no todo with ID ${todoId}`);

    if (!selectedTodo.children.length) {
      await this.todoRepository.delete(todoId);
    } else {
      for (const childId of selectedTodo.children) {
        await this.removeChildTodo(selectedTodo, childId as number);
        await this.removeTodoById(childId as number);
        await this.todoRepository.delete(todoId);
      }
    }
  }

  // if child todo is deleted, remove it from parent
  async removeChildTodo(
    currentTodo: TodoEntity,
    childTodoId: number,
  ): Promise<UpdateResult> {
    return this.todoRepository.update(currentTodo.id, {
      ...omit(currentTodo, 'id'),
      children: currentTodo.children.filter((id) => id !== childTodoId),
    });
  }
}
