import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Equal, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskGateway } from './task.gateway';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly taskGateway: TaskGateway,
  ) {}

  async create(user: User, createTaskDto: CreateTaskDto) {
    const { description, dueDate } = createTaskDto;
    try {
      const task = this.taskRepository.create({
        description: description,
        dueDate: new Date(dueDate),
        user,
      });
      await this.taskRepository.save(task);
      this.taskGateway.emitTaskToUser(user.id, task);
      return task;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll(user: User): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        user: { id: Equal(user.id) },
      },
    });
  }

  async findOne(taskId: string, user: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: Equal(taskId), user: { id: Equal(user.id) } },
      });

      if (!task) {
        throw new NotFoundException(`Task ${taskId} not found`);
      }
      return task;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(user: User, taskId: string, updateTaskDto: UpdateTaskDto) {
    try {
      await this.taskRepository.update(taskId, updateTaskDto);
      return await this.taskRepository.findOne({
        where: { id: Equal(taskId) },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string, user: User) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id: Equal(id), user: { id: Equal(user.id) } },
      });

      if (!task) throw new NotFoundException();

      await this.taskRepository.softDelete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
