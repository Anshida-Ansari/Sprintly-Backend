import { NextFunction,Request,Response } from "express";
import AppError from "../../../shared/utils/error-handling/app.errors";
import { BaseError } from "../../../shared/utils/error-handling/base.error";
import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";

export const errorMiddleware = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    console.log("Error caught by middleware =>", err);

    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            status: false,
            message:err.message,
            data:err.data || null,
        })
    }

    if(err instanceof BaseError){
        return res.status(err.statusCode).json({
            status:false,
            message:err.message,
        })
    }

    return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({
        status:false,
        message:"Something went wrong.  Please try again later"
    })

}