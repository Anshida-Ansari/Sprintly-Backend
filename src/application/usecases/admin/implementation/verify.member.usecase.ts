import { injectable } from "inversify";
import { IVerifyInvitationUseCase } from "../interface/verify.member.interface";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { parse } from "path";

@injectable()
export class VerifyInvitationUseCase implements IVerifyInvitationUseCase{
    constructor(

    ){}

    async execute(token: string): Promise<{ name: string; email: string; companyId: string; }> {
        try {
            const key =`member.invite:${token}`

            const data =await redisClient.get(key)

            if(!data){
                throw new Error(ErrorMessage.INVITATION_EXPIRED_OR_INVALID)
            }

            const parsed = JSON.parse(data)

            return  {
                name:parsed.name,
                email:parsed.email,
                companyId:parsed.companyId
            }

        } catch (error) {
            throw error
        }
    }
}