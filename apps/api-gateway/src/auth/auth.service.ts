import { Port } from '@app/common';
import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {

    private readonly authServiceUrl= `http://localhost:${Port.AUTH_SERVICE}`

    constructor( private readonly httpService:HttpService){}


    async register(data:{
        email:string,
        name:string,
        password:string
    }){
        try{
            const response= await firstValueFrom
            (this.httpService.post(`${this.authServiceUrl}/register`,data))

            return response.data
        }
        catch(error){
            this.handleError(error)
        }
    }


    //for login
    async login(data:{email:string,password:string}){
        try {

            let response=await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/login`,data)
            )

            return response.data
            
        } catch (error) {

            this.handleError(error)
            
        }
    }


    //get profile 
    async getProfile(token:string){
        try {

            let response= await firstValueFrom(
                this.httpService.get(`${this.authServiceUrl}/profile`,{
                    headers:{Authorization:token}
                })
            )

            return response.data


            
        } catch (error) {

            this.handleError(error)
            
        }
    }
    //Error function

    // this axios always give error 
    // {
    //     response: {
    //       status: 401,
    //       data: {
    //         message: "Invalid credentials"
    //       }
    //     }
    //   }
    private handleError(error:unknown):never{
        const err= error as {
            response?:{

                data:string | object;
                status:number

            }}
            if(err.response){
                throw new HttpException(err.response?.data, err.response?.status)
            }

            throw new HttpException("Something went wrong",503)
        }
    }










