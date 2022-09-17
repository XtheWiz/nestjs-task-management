
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './tasks.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`)
    }

    return found;
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const task = this.tasksRepository.createTask(createTaskDTO);
    return task;
  }

  getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO);
  }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
  //   const { status, search } = filterDTO

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter(task => task.status == status)
  //   }

  //   if (search) {
  //     tasks = tasks.filter(task => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //     });
  //   }

  //   return tasks;
  // }

  async deleteTaskById(id: string) {
    const result = await this.tasksRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`)
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}
