import { IGetProfileUseCase } from "@application/usecases/userprofile/interface/get.profile.usecase.interface";
import { IUpdateProfileUseCase } from "@application/usecases/userprofile/interface/update.profile.usecase.interface";
import { IGetDeveloperDashboardStatsUseCase } from "@application/usecases/userprofile/interface/get.developer.dashboard.stats.interface";
import { SuccessStatus } from "@domain/enum/status-codes/success.status.enum";
import { USER_PROFILE_TYPE } from "@infrastructure/di/types/userprofile/user.profile";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class UserProfileController {
    constructor(
        @inject(USER_PROFILE_TYPE.IUpdateProfileUseCase)
        private _updateProfileUseCase: IUpdateProfileUseCase,
        @inject(USER_PROFILE_TYPE.IGetProfileUseCase)
        private _getProfileUseCase: IGetProfileUseCase,
        @inject(USER_PROFILE_TYPE.IGetDeveloperDashboardStatsUseCase)
        private _getDeveloperDashboardStatsUseCase: IGetDeveloperDashboardStatsUseCase
    ) { }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.params


            const userId = req.user.id

            const result = await this._updateProfileUseCase.execute(
                req.body,
                companyId,
                userId
            )

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: "User profile Updated",
                data: result,
            });

        } catch (error) {
            next(error)
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.params

            const userId = req.user.id

            const result = await this._getProfileUseCase.execute(
                userId,
                companyId
            )


            return res.status(SuccessStatus.OK).json({
                success: true,
                message: "User profile got Successfully",
                data: result,
            });


        } catch (error) {
            next(error)
        }
    }

    async getDashboardStats(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.params;
            const userId = req.user.id;

            const stats = await this._getDeveloperDashboardStatsUseCase.execute(userId, companyId);

            return res.status(SuccessStatus.OK).json({
                success: true,
                message: "Dashboard stats fetched successfully",
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}