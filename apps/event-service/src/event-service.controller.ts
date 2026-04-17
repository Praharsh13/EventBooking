import { Body, Controller, Get, Headers, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { EventServiceService } from './event-service.service';
import { CreateEventDto } from '@app/common/dtos/create-event.dto';
import { UpdateEventDto } from '@app/common/dtos/update-event.dto';

@Controller()
export class EventServiceController {
  constructor(private readonly eventServiceService: EventServiceService) {}

  @Post()
  async createEvent(
    @Body() createeventDto:CreateEventDto,
    @Headers('x-user-id') userId:string

  ){

     return this.eventServiceService.create(createeventDto,userId)


  }

  @Get("all-events")
  async findAllEvent(){
    return this.eventServiceService.findAllEvents()
  }

  @Get(':id')
  async findEventById(@Param('id',ParseUUIDPipe)id:string){
    return this.eventServiceService.findEventById(id)
  }

  @Put(':id')
  async update(
    @Param('id',ParseUUIDPipe) id:string,
    @Body() updateEvebtDto:UpdateEventDto,
    @Headers('x-user-id') userId:string,
    @Headers('x-user-role') userRole:string
  ){
    return this.eventServiceService.update(
      id,
      updateEvebtDto,
      userId,
      userRole
    )
  }

  @Post(':id/publish')
  async publish(
    @Param('id',ParseUUIDPipe) id:string,
    
    @Headers('x-user-id') userId:string,
    @Headers('x-user-role') userRole:string
  ){
    return this.eventServiceService.publishEvent(
      id,
      userId,
      userRole
    )
  }

  @Post(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    return this.eventServiceService.cancel(id, userId, userRole);
  }

  @Get('my-events')
  findMyEvent(@Headers('x-user-id') userId: string) {
    return this.eventServiceService.findMyEvent(userId);
  }
}
