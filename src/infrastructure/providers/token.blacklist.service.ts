import { injectable } from "inversify";
import { redisClient } from "./redis/redis.provider";

@injectable()
export class TokenBlacklistService {
    async revokeUserRefreshTokens(email: string): Promise<void> {
        try {
            await redisClient.del(`refresh:${email}`);
        } catch (error) {
            throw error;
        }
    }
}
