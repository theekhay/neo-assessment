import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.gaurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { IAuthenticatedReq } from '../interfaces/Auth-request.interface';

@Controller('task')
@ApiTags('Task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiBearerAuth('JWT')
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: IAuthenticatedReq) {
    return this.taskService.create(req.user, createTaskDto);
  }

  @Get()
  @ApiBearerAuth('JWT')
  findAll(@Req() req: IAuthenticatedReq) {
    return this.taskService.findAll(req.user);
  }

  @Get(':id')
  @ApiBearerAuth('JWT')
  findOne(@Param('id') id: string, @Req() req: IAuthenticatedReq) {
    return this.taskService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: IAuthenticatedReq,
  ) {
    return this.taskService.update(req.user, id, updateTaskDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.taskService.remove(id, req.user);
  }
}
