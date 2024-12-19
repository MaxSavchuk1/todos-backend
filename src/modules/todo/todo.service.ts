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

  async findRootTodos(userId: number): Promise<TodoEntity[]> {
    return this.todoRepository.find({
      where: { parentId: IsNull(), user: { id: userId } },
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
            const foundTodo = await this.todoRepository.findOneBy({
              id: childId,
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

  async createTodo(data: CreateTodoDto, userId: number): Promise<TodoEntity> {
    if (!data.title)
      throw new UnprocessableEntityException('Title is required');

    const savedTodo = await this.todoRepository.save({
      ...data,
      user: { id: userId },
    });

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

  async updateTodo(
    id: number,
    userId: number,
    data: UpdateTodoDto,
  ): Promise<void> {
    const currentTodo: TodoEntity = await this.todoRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!currentTodo) throw new NotFoundException();

    if (!STATUSES.includes(data?.status))
      throw new UnprocessableEntityException(
        `Invalid status. Available: ${STATUSES.join(', ')}`,
      );

    await this.todoRepository.update(id, data);
  }

  async removeTodoById(todoId: number, userId: number): Promise<void> {
    const selectedTodo: TodoEntity = await this.todoRepository.findOne({
      where: { id: todoId, user: { id: userId } },
    });
    if (!selectedTodo) throw new NotFoundException();

    if (!selectedTodo.children.length) {
      await this.todoRepository.delete(todoId);
    } else {
      for (const childId of selectedTodo.children) {
        await this.removeChildTodo(selectedTodo, childId as number);
        await this.removeTodoById(childId as number, userId);
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
