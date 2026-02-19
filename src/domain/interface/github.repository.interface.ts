export interface GitHubRepository {
	name: string;
	fullName: string;
	htmlUrl: string;
	cloneUrl: string;
	sshUrl: string;
	isPrivate: boolean;
	description: string;
}

export interface IGitHubRepositoryService {
	createRepository(
		accessToken: string,
		repoName: string,
		description: string,
		isPrivate: boolean,
		organization?: string,
	): Promise<GitHubRepository>;

	getRepository(
		accessToken: string,
		owner: string,
		repo: string,
	): Promise<GitHubRepository>;

	deleteRepository(
		accessToken: string,
		owner: string,
		repo: string,
	): Promise<void>;

	sanitizeRepoName(projectName: string): string;
}
