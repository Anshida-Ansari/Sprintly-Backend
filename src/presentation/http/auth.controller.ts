import { Request,Response } from "express"

export const registerController = async(req:Request,res:Response)=>{
    try {
        res.status(201).json({message:"User registered successfully"})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}