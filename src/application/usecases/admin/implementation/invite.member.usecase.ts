import { inject, injectable } from "inversify";
import crypto from "node:crypto";
import type { InviteMemberDTO } from "@application/dtos/admin/invite.member.dto";
import type { IInviteMemberUseCase } from "@application/usecases/admin/interface/invite.member.interface";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import env from "@infrastructure/providers/env/env.validation";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { sendInviteEmail } from "@shared/utils/send.invitaion.util";

@injectable()
export class InviteMemberUseCase implements IInviteMemberUseCase {
    constructor(
        @inject(USER_TYPES.IUserRepository)
        private _userRepository: IUserRepository
    ) { }

    async execute(dto: InviteMemberDTO, companyId: string, adminId: string): Promise<{ message: string; inviteLink: string; }> {

        const existing = await this._userRepository.findOne({ email: dto.email })
        if (existing) {
            throw new ConflictError(ErrorMessage.EMAIL_ALREADY_EXISTS)
        }

        const token = crypto.randomBytes(20).toString("hex")

        const key = `member.invite:${token}`


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

        const frontendUrl = env.FRONTENT_URL || "http://localhost:5173";

        const inviteLink = `${frontendUrl}/member/accept?token=${token}`;
        console.log(inviteLink);


        await sendInviteEmail(dto.email, inviteLink)

        return {
            message: "Invitation  send successfully",
            inviteLink: inviteLink
        }



    }
}