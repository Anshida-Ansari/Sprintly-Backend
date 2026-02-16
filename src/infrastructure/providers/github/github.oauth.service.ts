import { injectable } from "inversify";
import { OAuthApp } from "@octokit/oauth-app";
import { Octokit } from "@octokit/rest";
import type {
    IGitHubOAuthService,
    GitHubOAuthTokens,
    GitHubUserInfo,
} from "../../../domain/interface/github.oauth.interface";

@injectable()
export class GitHubOAuthService implements IGitHubOAuthService {
    private oauthApp: OAuthApp;
    private clientId: string;
    private clientSecret: string;
    private callbackUrl: string;

    constructor() {
        this.clientId = process.env.GITHUB_CLIENT_ID || "";
        this.clientSecret = process.env.GITHUB_CLIENT_SECRET || "";
        this.callbackUrl = process.env.GITHUB_CALLBACK_URL || "";

        if (!this.clientId || !this.clientSecret) {
            throw new Error(
                "GitHub OAuth credentials not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in environment variables.",
            );
        }

        this.oauthApp = new OAuthApp({
            clientType: "oauth-app",
            clientId: this.clientId,
            clientSecret: this.clientSecret,
        });
    }

    getAuthorizationUrl(state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.callbackUrl,
            scope: "repo,user:email,read:org",
            state: state,
        });

        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }

    async exchangeCodeForToken(code: string): Promise<GitHubOAuthTokens> {
        try {
            const { authentication } = await this.oauthApp.createToken({
                code,
            });

            return {
                accessToken: authentication.token,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to exchange code for token: ${message}`);
        }
    }

    async getUserInfo(accessToken: string): Promise<GitHubUserInfo> {
        try {
            const octokit = new Octokit({
                auth: accessToken,
            });

            const { data: user } = await octokit.rest.users.getAuthenticated();

            const { data: emails } = await octokit.rest.users.listEmailsForAuthenticatedUser();
            const primaryEmail =
                emails.find((email) => email.primary)?.email || user.email || "";

            return {
                username: user.login,
                email: primaryEmail,
                name: user.name || user.login,
                avatarUrl: user.avatar_url,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to get user info: ${message}`);
        }
    }
}
