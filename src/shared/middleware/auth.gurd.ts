import { Request, Response, NextFunction } from "express";
import { ErrorMessage } from "../../domain/enum/messages/error.message.enum"
import { ClientErrorStatus } from "../../domain/enum/status-codes/client.error.status.enum"
import { verifyToken } from "../utils/jwt.util";
import { inject } from "inversify";
import { USER_TYPES } from "../../infrastructure/di/types/user/user.types";
import { IUserRepository } from "../../infrastructure/db/repository/interface/user.interface";

export class AuthGurd {
    constructor(

        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository

    ) { }
    authorize(allowedRoles: string[]) {

        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authHeader = req.headers.authorization

                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return res.status(ClientErrorStatus.UNAUTHORIZED).json({
                        success: false,
                        message: ErrorMessage.TOKEN_MISSING
                    })
                }

                const token = authHeader.split(' ')[1]

                const decoded = await verifyToken(token, "access") as {
                    id: string,
                    email: string,
                    role: string,

                }

                if (!decoded) {
                    return res.status(ClientErrorStatus.UNAUTHORIZED).json({
                        success: false,
                        message: "Token verification failed"
                    })
                }

                if (!allowedRoles.includes(decoded.role)) {
                    return res.status(ClientErrorStatus.UNAUTHORIZED).json({
                        success: false,
                        message: "You are not allowed to access this route"
                    })
                }


                const user = await this._userRepository.findById(decoded.id)

                if (!user) {
                    return res.status(ClientErrorStatus.UNAUTHORIZED).json({
                        success: false,
                        message: "User not found"
                    })
                }

                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    companyId: user.companyId ?? "",
                    adminId: user.adminId ?? ""
                }

                next()

            } catch (error) {

                return res.status(ClientErrorStatus.NOT_FOUND).json({
                    success: false,
                    message: ErrorMessage.USER_NOT_FOUND
                })
            }

        }

    }

}