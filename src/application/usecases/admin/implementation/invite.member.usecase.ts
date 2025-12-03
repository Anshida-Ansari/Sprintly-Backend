import { inject, injectable } from "inversify";
import { IInviteMemberUseCase } from "../interface/invite.member.interface";
import { USER_TYPES } from "src/infrastructure/di/types/user/user.types";
import { UserRepository } from "src/infrastructure/db/repository/implements/user.repository";
import { IUserRepository } from "src/infrastructure/db/repository/interface/user.interface";
import { InviteMemberDTO } from "src/application/dtos/admin/invite.member.dto";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import crypto from "crypto";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { sendInviteEmail } from "src/shared/utils/send.invitaion.util";

@injectable()
export class InviteMemberUseCase implements IInviteMemberUseCase{
    constructor(
        @inject(USER_TYPES.UserRepository) 
        private _userRepository:IUserRepository
    ){}

    async execute(dto: InviteMemberDTO, companyId: string): Promise<{ message: string; inviteLink: string; }> {
        try {
            console.log('reching the usecase');
            
            const existing  = await this._userRepository.findOne({email:dto.email})
            if(existing){
                throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS)
            }

            const token = crypto.randomBytes(20).toString("hex")
            console.log(token);
            
            const key = `member.invite:${token}`
            console.log(key);
            

            await redisClient.set(
                key,
                JSON.stringify({
                    name:dto.name,
                    email:dto.email,
                    companyId:companyId
                }),

                "EX",
                172800
            )

            const inviteLink = `https://sprintly.com/member.accept?token=${token}`

            console.log(inviteLink);
            

            await sendInviteEmail(dto.email,inviteLink)

            return {
                message:"Invitation  send successfully",
                inviteLink:inviteLink
            }


        } catch (error) {
            
            throw error
        }
    }
}