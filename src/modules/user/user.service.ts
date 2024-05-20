import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    try {
      const isExistingUser = await this.findUserByEmail(email);
      if (!isExistingUser) {
        const hashedPassword = await argon.hash(password);

        return await this.userRepository.save({
          email,
          password: hashedPassword,
        });
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find({ select: ['id', 'username'] });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: Equal(id) },
      });
      console.log(user);
      if (!user) throw new NotFoundException('User not found');
      console.log('user dey');
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = this.findById(id);
      if (!user) throw new NotFoundException();
      await this.userRepository.update(id, updateUserDto);
      const updatedUser = await this.findById(id);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDTO) {
    const { id, password } = resetPasswordDto;
    try {
      const user = await this.findById(id);
      if (!user) throw new NotFoundException();
      const hashedPassword = await argon.hash(password);
      await this.userRepository.update(id, { password: hashedPassword });
      return {
        statusCode: HttpStatus.OK,
        message: 'Password has been changed successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findById(id);
      if (!user) throw new NotFoundException();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserByUsername(username: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { username: username },
    });
    return !!existingUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: Equal(email) },
    });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (user) {
      const isPasswordValid = await argon.verify(user.password, password);
      if (isPasswordValid) {
        return user;
      }
      throw new NotFoundException('Invalid Credentials');
    }
    return null;
  }
}
