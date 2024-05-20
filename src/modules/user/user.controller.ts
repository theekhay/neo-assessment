import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Patch('reset-password')
  @ApiResponse({ status: 200, description: 'Success' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
