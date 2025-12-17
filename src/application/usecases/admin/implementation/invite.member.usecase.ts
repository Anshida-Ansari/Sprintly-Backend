import { inject, injectable } from "inversify";
import { IInviteMemberUseCase } from "../interface/invite.member.interface";
import { USER_TYPES } from "../../../../infrastructure/di/types/user/user.types";
import { IUserRepository } from "../../../../infrastructure/db/repository/interface/user.interface";
import { InviteMemberDTO } from "../../../dtos/admin/invite.member.dto";
import { ErrorMessage } from "../../../../domain/enum/messages/error.message.enum";
import crypto from "crypto";
import { redisClient } from "../../../../infrastructure/providers/redis/redis.provider";
import { sendInviteEmail } from "../../../../shared/utils/send.invitaion.util";

@injectable()
export class InviteMemberUseCase implements IInviteMemberUseCase {
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository
    ) { }
    
    async execute(dto: InviteMemberDTO, companyId: string, adminId: string): Promise<{ message: string; inviteLink: string; }> {
        try {
            

            const existing = await this._userRepository.findOne({ email: dto.email })
            if (existing) {
                throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS)
            }

            const token = crypto.randomBytes(20).toString("hex")
            console.log("generated token",token);

            const key = `member.invite:${token}`
            console.log("saving to redis key",key);


            await redisClient.set(
                key,
                JSON.stringify({
                    name: dto.name,
                    email: dto.email,
                    companyId,
                    adminId
                }),

                "EX",
                172800
            )

            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

            const inviteLink = `${frontendUrl}/member/accept?token=${token}`;
            console.log(inviteLink);


            await sendInviteEmail(dto.email, inviteLink)

            return {
                message: "Invitation  send successfully",
                inviteLink: inviteLink
            }


        } catch (error) {

            throw error
        }
    }
}