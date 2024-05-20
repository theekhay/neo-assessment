import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dtos/auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { ResponseModel } from '../models/response.model';
import { GENERIC_RESPONSE_STATUS } from '../enums/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(authPayload: LoginDTO) {
    const { email, password } = authPayload;

    const user = await this.userService.validateUser(email, password);
    const jwtPayload = {
      username: email,
      userId: user.id,
    };
    if (user) {
      const token = this.jwtService.sign(jwtPayload);
      return new ResponseModel(
        GENERIC_RESPONSE_STATUS.SUCCESS,
        'Login successful',
        { token },
      );
    }

    throw new UnauthorizedException('Invalid username or password');
  }
}
