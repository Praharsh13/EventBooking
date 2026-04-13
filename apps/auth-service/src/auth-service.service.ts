import { DatabaseService, users } from '@app/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { ConflictException, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthServiceService implements OnModuleInit {

  constructor(@Inject(KAFKA_SERVICE) private readonly kafkaClient:ClientKafka ,
              private readonly dbService:DatabaseService,
              private readonly jwtService:JwtService
  
  ){

  }

  async onModuleInit() {
      await this.kafkaClient.connect()
  }
  getHello(): string {
    return 'Hello World!';
  }

  async register(email:string,password:string,name:string){

    let existingUser= await this.dbService.db
    .select()
    .from(users)
    .where(eq(users.email,email))
    .limit(1)

    if(existingUser.length>0){
      throw new ConflictException('User already exist')
    }

    let hashPassword= await bcrypt.hash(password,10)

    //create user

    const [user]= await this.dbService.db
    .insert(users)
    .values({email,password:hashPassword,name})
    .returning()


    //sending to the kafka

    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED,{
      userId:user.id,
      email:user.email,
      name:user.name,
      timestamps:new Date().toISOString()
    })

    return {message:'User registered successfully',userId:user.id}

  }


  //to login 

  async login(email:string,password:string){

    //Check if email is exist or not
    let [user]= await this.dbService.db
    .select()
    .from(users)
    .where(eq(users.email,email))
    .limit(1)

    if(!user || !(await bcrypt.compare(password,user.password))){
      throw new UnauthorizedException('Invalid Credentials')
    }

    //Sign the token
    const token=this.jwtService.sign({sub:user.id,email:user.email})

    this.kafkaClient.emit(KAFKA_TOPICS.USER_LOGIN,{
      userId:user.id,
      timestamp:new Date().toISOString()
    })

    return {
      access_token:token,
      user:{
        email:user.email,
        name:user.name,
        role:user.role,
        id:user.id
      }
    }
  }

  async getProfile(userId: string) {
    const [user] = await this.dbService.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  
}
