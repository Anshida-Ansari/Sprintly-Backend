import type { NextFunction, Request, Response } from "express";
import { IAddStandupCommentUseCase } from "@application/usecases/standup/interface/add.standup.comment.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { inject, injectable } from "inversify";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { ISubmitStandupUseCase } from "@application/usecases/standup/interface/submit.standup.interface";

@injectable()
export class StandupController {
    constructor(
        @inject(STANDUP_TYPES.IAddStandupCommentUseCase)
        private _addstandupUseCase: IAddStandupCommentUseCase,
        @inject(STANDUP_TYPES.ISubmitStandupUseCase)
        private _submitStandupUseCase: ISubmitStandupUseCase
    ) { }

    async addStandup(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: userId, userName, companyId } = req.user;
            const { projectId, sprintId, standupId } = req.params;

            const result = await this._addstandupUseCase.execute(
                req.body,
                userId,
                userName,
                companyId,
                sprintId,
                projectId,
                standupId
            );

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: 'Comment added successfully',
                data: result
            });


        } catch (error) {
            next(error)
        }
    }
    async submitStandup(req: Request, res: Response, next: NextFunction) {
    try {
        const { id: userId, companyId } = req.user; 
        const { projectId, sprintId } = req.params;

        await this._submitStandupUseCase.execute(
            req.body, 
            userId, 
            sprintId, 
            projectId, 
            companyId
        );

        return res.status(SuccessStatus.OK).json({
            success: true,
            message: 'Standup submitted successfully'
        });
    } catch (error) {
        next(error);
    }
} 

}