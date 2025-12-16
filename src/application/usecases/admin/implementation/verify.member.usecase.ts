import { injectable } from "inversify";
import { IVerifyInvitationUseCase } from "../interface/verify.member.interface";
import { redisClient } from "src/infrastructure/providers/redis/redis.provider";
import { ErrorMessage } from "src/domain/enum/messages/error.message.enum";
import { parse } from "path";

@injectable()
export class VerifyInvitationUseCase implements IVerifyInvitationUseCase {
    constructor(

    ) { }



    async execute(token: string): Promise<{ name: string; email: string; companyId: string; }> {
        try {


            console.log('I reached the verify usecase as you can see');


            const key = `member.invite:${token}`
            console.log("the key is ", key);

            const data = await redisClient.get(key)
            console.log("the data is ", data);

            if (!data) {
                throw new Error(ErrorMessage.INVITATION_EXPIRED_OR_INVALID)
            }

            const parsed = JSON.parse(data)
            console.log("Verify token:", token);
            console.log("Redis key:", key);
            console.log("Redis data:", data);

            return {
                name: parsed.name,
                email: parsed.email,
                companyId: parsed.companyId
            }

        } catch (error) {
            throw error
        }
    }
}


