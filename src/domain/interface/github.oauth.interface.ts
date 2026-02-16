export interface GitHubUserInfo {
    username: string;
    email: string;
    name: string;
    avatarUrl: string;
}

export interface GitHubOAuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    refreshTokenExpiresIn?: number;
}

export interface IGitHubOAuthService {
   
    getAuthorizationUrl(state: string): string;

    exchangeCodeForToken(code: string): Promise<GitHubOAuthTokens>;

    getUserInfo(accessToken: string): Promise<GitHubUserInfo>;
}
