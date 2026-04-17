import { Port } from '@app/common';
import { CreateEventDto } from '@app/common/dtos/create-event.dto';
import { UpdateEventDto } from '@app/common/dtos/update-event.dto';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {

    private readonly eventserviceUrl=`http://localhost:${Port.EVENT_SERVICE}`

    constructor(private readonly httpService:HttpService){

    }

    //1.create event
     async create(
        data:CreateEventDto,
        userId:string,
        userRole:string
     ){
        try {
            let response= await firstValueFrom(
                this.httpService.post(`${this.eventserviceUrl}`,data,{
                    headers:{'x-user-id':userId,'x-user-role':userRole}
                })
            )
            return response.data
        } catch (error) {

            this.handleError(error)
            
        }

     }

     //2.find all events
     async allEvents(){
        try {
            let response=await firstValueFrom(
                this.httpService.get(`${this.eventserviceUrl}/all-events`)
            ) 
            return response.data
        } catch (error) {

            this.handleError(error)
            
        }
     }


     //3.get event by id
     async eventById(id:string){
        try {
            let response=await firstValueFrom(
                this.httpService.get(`${this.eventserviceUrl}/${id}`)
            ) 
            return response.data
        } catch (error) {

            this.handleError(error)
            
        }
     }

//4.find my event
     async myEvent(userId:string){
        try {
            let response=await firstValueFrom(
                this.httpService.get(`${this.eventserviceUrl}/my-events`,{
                    headers:{'x-user-id':userId}
                })
            ) 
            return response.data
        } catch (error) {

            this.handleError(error)
            
        }
     }

     //5.Update event
     async update(
        id:string,
        data:UpdateEventDto,
        userId:string,
        userRole:string
     ){
        try {
            let response= await firstValueFrom(
                this.httpService.put(`${this.eventserviceUrl}/${id}`,data,{
                    headers:{'x-user-id':userId,'x-user-role':userRole}
                })
            )
            return response.data
        } catch (error) {

            this.handleError(error)
            
        }

     }

     //6.Publish event
     async publishEvent(
        id:string,
        userId:string,
        userRole:string
     ){
        try {
            let response= await firstValueFrom(
                this.httpService.post(`${this.eventserviceUrl}/${id}/publish`,{
                    headers:{'x-user-id':userId,'x-user-role':userRole}
                })
            )
            return response.data
        } catch (error) {

            this.handleError(error)
            
        }

     }

     //7.cancel event
     async cancel(
        id:string,
        userId:string,
        userRole:string
     ){
        try {
            let response= await firstValueFrom(
                this.httpService.post(`${this.eventserviceUrl}/${id}/cancel`,{
                    headers:{'x-user-id':userId,'x-user-role':userRole}
                })
            )
            return response.data
        } catch (error) {

            this.handleError(error)
            
        }

     }














    //exceptional handling

    private handleError(error:unknown):never{
        let err= error as {
            response?:{
                data:string | object,
                status:number
            }
        }

        if(err.response){
            throw new HttpException(err.response.data,err.response.status)
        }

        throw new HttpException("Something went wrong",503)
    }
}
