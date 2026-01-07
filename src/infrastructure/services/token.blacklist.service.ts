import { injectable } from "inversify";
import { redisClient } from "../providers/redis/redis.provider";

@injectable()
export class TokenBlacklistService {
    async revokeUserRefreshTokens(email: string): Promise<void> {
        try {
            await redisClient.del(`refresh:${email}`);
            console.log(`[TokenBlacklistService] Revoked refresh tokens for: ${email}`);
        } catch (error) {
            console.error(`[TokenBlacklistService] Error revoking refresh tokens for ${email}:`, error);
            throw error;
        }
    }
}
