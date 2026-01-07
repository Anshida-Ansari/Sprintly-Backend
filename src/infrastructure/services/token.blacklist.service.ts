import { injectable } from "inversify";
import { redisClient } from "../providers/redis/redis.provider";

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
