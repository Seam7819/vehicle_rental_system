import  jwt, { JwtPayload }  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express"
import config from '../config';

const auth = (...roles: string[]) =>{
    // console.log(roles);
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const token = req.headers.authorization;
        // console.log(token);
        if(!token){
            throw new Error("you are not authorized");
        }
        const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload; 
        // console.log(decoded);
        
        req.user = decoded as JwtPayload;
        if(roles.length && !roles.includes(decoded.role as string)){
            res.status(500).json({
                message: "unauthorized"
            })
        }
        next();
        }catch(err:any) {
            res.status(500).json({
                status: false,
                message: err.message
            })
        }
    }
}

export default auth;