import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from '@app/common/dtos/create-event.dto';
import { UpdateEventDto } from '@app/common/dtos/update-event.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventService:EventsService){

    }

    //1.get all events
    @Get()
    async findAll(){
        return this.eventService.allEvents()
    }


    //2. get my event , it is protected route
    @UseGuards(AuthGuard('jwt'))
    @Get('my-events')
    findMyEvents(@Request() req:{user:{userId:string}}){
        return this.eventService.myEvent(req.user.userId)
    }

    //3.get event by id- public event 

    @Get(':id')
    getEventById(@Param('id',ParseUUIDPipe) id:string){
        return this.eventService.eventById(id)
    }

    //4 Create event - Protected route
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(
        @Body() data:CreateEventDto,
        @Request() req: {user:{userId:string,role?:string}}
    ){

         return this.eventService.create(data,
            req.user.userId,
            req.user.role || 'USER')

    }


    //5. Update event 
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(

        @Param('id',ParseUUIDPipe) id:string,

        @Body() data:UpdateEventDto,
        @Request() req: {user:{userId:string,role?:string}}
    ){
        console.log(id)

        return this.eventService.update(id,data,
            req.user.userId,
            req.user.role || 'USER')

    }

    // Protected - publish event
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/publish')
  publish(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.eventService.publishEvent(
      id,
      req.user.userId,
      req.user.role || 'USER',
    );
  }

  // Protected - cancel event
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.eventService.cancel(
      id,
      req.user.userId,
      req.user.role || 'USER',
    );
  }






}
