import { CreateEventDto } from '@app/common/dtos/create-event.dto';
import { UpdateEventDto } from '@app/common/dtos/update-event.dto';
import { DatabaseService } from '@app/database';
import { events } from '@app/database/schema/events';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { eq } from 'drizzle-orm';

@Injectable()
export class EventServiceService implements OnModuleInit {
  // getHello(): string {
  //   return 'Hello World!';
  // }

  constructor(@Inject(KAFKA_SERVICE) private readonly kafkaClient:ClientKafka,
  private readonly dbService:DatabaseService
  ){}

  async onModuleInit() {
      await this.kafkaClient.connect()
  }

  //Creating event
  async create(createEventdto:CreateEventDto,organizerId:string){
    const [event]=await this.dbService.db
    .insert(events)
    .values({
      ...createEventdto,
      date:new Date(createEventdto.date),
      price:createEventdto.price || 0,
      organizerId
    })
    .returning()

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CREATED,{
      eventId:event.id,
      organizerId:event.organizerId,
      title:event.title,
      timestamp:new Date().toISOString()
    })

    return event
  }

  //find all events
  async findAllEvents(){
    let list= this.dbService.db
    .select()
    .from(events)
    .where(eq(events.status,"PUBLISHED"))

    return list
  }

  //find one event with id
  async findEventById(id:string){
    let [event]=await this.dbService.db
    .select()
    .from(events)
    .where(eq(events.id,id))
    .limit(1)

    if(!event){
      throw new NotFoundException("No event found")
    }

    return event
  }


  async update(
    id:string,
    updateDta:UpdateEventDto,
    userId:string,
    userRole:string
    ){

      const event=await this.findEventById(id)
      if(event.organizerId!==userId && userRole!=='ADMIN'){

        throw new ForbiddenException('You are not authorize to update this event')

      }

      const updatedData:Record<string, unknown> ={...updateDta};
      if (updateDta.date) {
        updatedData.date = new Date(updateDta.date);
      }
      updatedData.updatedAt = new Date();

      let [update]= await this.dbService.db
      .update(events)
      .set(updatedData)
      .where(eq(events.id,id))
      .returning()

      this.kafkaClient.emit(KAFKA_TOPICS.EVENT_UPDATED,{
        eventId:update.id,
        changes:Object.keys(updateDta),
        timestamp:new Date().toISOString()
      })
     
      return update


    }

    //publish events
    async publishEvent(id:string,userId:string,userRole:string){
      let event= await this.findEventById(id)

      if(event.organizerId!==userId && userRole!=='ADMIN' ){
        throw new ForbiddenException('You are not authorixed to upadte event')
      }

      let [published]=await this.dbService.db
      .update(events)
      .set({status:'PUBLISHED',updatedAt:new Date()})
      .where(eq(events.id,id))
      .returning()

      return published
    }

    async cancel(id: string, userId: string, userRole: string) {
      const event = await this.findEventById(id);
  
      if (event.organizerId !== userId && userRole !== 'ADMIN') {
        throw new ForbiddenException(
          'You are not authorized to cancel this event',
        );
      }
  
      const [cancelled] = await this.dbService.db
        .update(events)
        .set({ status: 'CANCELLED', updatedAt: new Date() })
        .where(eq(events.id, id))
        .returning();
  
      this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CANCELLED, {
        eventId: cancelled.id,
        organizerId: cancelled.organizerId,
        timestamp: new Date().toISOString(),
      });
  
      return cancelled;
    }
  
    async findMyEvent(organizerId: string) {
      return this.dbService.db
        .select()
        .from(events)
        .where(eq(events.organizerId, organizerId));
    }



     


}
