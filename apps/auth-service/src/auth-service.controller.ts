import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import UserRegisterDto from '@app/common/dtos/userregister.dto';
import { register } from 'module';
import LoginDto from '@app/common/dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get()
  getHello(): string {
    return this.authServiceService.getHello();
  }


  @Post("register")
  async register(@Body() user:UserRegisterDto){
    return this.authServiceService.register(user.email,user.password,user.name)

  }

  @Post("login")
  async login(@Body() user:LoginDto){
    return this.authServiceService.login(user.email,user.password)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req:{user:{userId:string}}){
    return this.authServiceService.getProfile(req.user.userId)
  }

}


