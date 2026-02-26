import { Request, Response } from "express";
import { authService } from "./auth.service";

const signUp = async(req:Request,res:Response)=>{
    try{
        const user = await authService.signUp(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user.rows[0]
        })
    }catch(err: any){
        res.status(500).json({
            success : false,
            message: err.message
        })
    }
}

const signIn = async(req:Request,res:Response)=>{
    try{
        const {email,password} = req.body;
        const user = await authService.signIn(email,password);
        res.status(201).json({
            success: true,
            message: "LogIn successful",
            data: user,
        })
    }catch(err: any){
        res.status(500).json({
            success : false,
            message: err.message
        })
    }
}

export const authController = {
    signUp,
    signIn
}