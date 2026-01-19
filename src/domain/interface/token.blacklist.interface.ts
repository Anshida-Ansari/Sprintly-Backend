export interface ITokenBlacklistService {
    revokeUserRefreshTokens(email: string): Promise<void>;
}
