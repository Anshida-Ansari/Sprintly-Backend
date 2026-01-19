import { injectable } from "inversify";
import { redisClient } from "../redis/redis.provider";
import type { ITokenBlacklistService } from "@domain/interface/token.blacklist.interface";

@injectable()
export class TokenBlacklistService implements ITokenBlacklistService {
    async revokeUserRefreshTokens(email: string): Promise<void> {
        await redisClient.del(`refresh:${email}`);
    }
}
