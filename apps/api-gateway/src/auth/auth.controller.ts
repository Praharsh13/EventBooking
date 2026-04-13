import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import UserRegisterDto from '@app/common/dtos/userregister.dto';
import LoginDto from '@app/common/dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService ){}


    @Post('/register')
    async register(@Body() data:UserRegisterDto){

        return this.authService.register(data)

    }

    @Post('/login')
    async login(@Body() data:LoginDto){
        return this.authService.login(data)
    }

    @Get('/profile')
    async getProfile(@Headers('authorization') authorization:string){

        return this.authService.getProfile(authorization)

    }
}
