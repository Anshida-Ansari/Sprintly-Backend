import { injectable } from "inversify";
import { redisClient } from "./redis/redis.provider";

@injectable()
export class TokenBlacklistService {
    async revokeUserRefreshTokens(email: string): Promise<void> {
            await redisClient.del(`refresh:${email}`);
    }
}
