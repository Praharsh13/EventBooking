import { Injectable } from "@nestjs/common";

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


//This class will help to get the header from the request coming , then put in the request like 
//req.user= { userId:id,email:useremal}
//That will retrieve from the payload of JWT from header
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:process.env.JWT_SECRET || 'secret'
        })
    }

    validate(payload:{sub:string;email:string}) {

        return {
            userId:payload.sub,
            email:payload.email
        }
        
    }

}