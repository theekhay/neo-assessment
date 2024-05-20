import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { LoginDTO } from './dtos/auth.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.gaurd';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() authPayload: LoginDTO) {
    return this.authService.login(authPayload);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log('Inside Auth');
    console.log(req.user);
  }
}
