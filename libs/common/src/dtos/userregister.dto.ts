import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export default class UserRegisterDto{


   @IsString({message:'Name must be string'})
   @IsNotEmpty({message:"Nmae cannot be empty"})
    name:string


    @IsEmail({},{message:'Please provide valid email'})
    @IsNotEmpty({message:'Email cannot be empty'})
    email:string

    @IsNotEmpty({message:"password cannot be empty"})
    @IsString({message:"Password cannt be string"})
    @MinLength(6,{message:"password must be more than 6"})
    password:string
}