import { Octokit } from "@octokit/rest";
import { injectable } from "inversify";
import type {
	GitHubRepository,
	IGitHubRepositoryService,
} from "../../../domain/interface/github.repository.interface";

@injectable()
export class GitHubRepositoryService implements IGitHubRepositoryService {
	async createRepository(
		accessToken: string,
		repoName: string,
		description: string,
		isPrivate: boolean,
		organization?: string,
	): Promise<GitHubRepository> {
		try {
			const octokit = new Octokit({
				auth: accessToken,
			});

			const sanitizedName = this.sanitizeRepoName(repoName);

			let response: any;

			if (organization) {
				response = await octokit.rest.repos.createInOrg({
					org: organization,
					name: sanitizedName,
					description: description,
					private: isPrivate,
					auto_init: true,
				});
			} else {
				response = await octokit.rest.repos.createForAuthenticatedUser({
					name: sanitizedName,
					description: description,
					private: isPrivate,
					auto_init: true,
				});
			}

			const repo = response.data;

			return {
				name: repo.name,
				fullName: repo.full_name,
				htmlUrl: repo.html_url,
				cloneUrl: repo.clone_url,
				sshUrl: repo.ssh_url,
				isPrivate: repo.private,
				description: repo.description || "",
			};
		} catch (error: any) {
			throw new Error(`Failed to create repository: ${error.message}`);
		}
	}

	async getRepository(
		accessToken: string,
		owner: string,
		repo: string,
	): Promise<GitHubRepository> {
		try {
			const octokit = new Octokit({
				auth: accessToken,
			});

			const { data } = await octokit.rest.repos.get({
				owner,
				repo,
			});

			return {
				name: data.name,
				fullName: data.full_name,
				htmlUrl: data.html_url,
				cloneUrl: data.clone_url,
				sshUrl: data.ssh_url,
				isPrivate: data.private,
				description: data.description || "",
			};
		} catch (error: any) {
			throw new Error(`Failed to get repository: ${error.message}`);
		}
	}

	async deleteRepository(
		accessToken: string,
		owner: string,
		repo: string,
	): Promise<void> {
		try {
			const octokit = new Octokit({
				auth: accessToken,
			});

			await octokit.rest.repos.delete({
				owner,
				repo,
			});
		} catch (error: any) {
			throw new Error(`Failed to delete repository: ${error.message}`);
		}
	}

	sanitizeRepoName(projectName: string): string {
		let sanitized = projectName
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9._-]/g, "-")
			.replace(/-+/g, "-")
			.replace(/^[.-]+|[.-]+$/g, "");

		if (sanitized.endsWith(".git")) {
			sanitized = sanitized.slice(0, -4);
		}

		if (sanitized.length > 100) {
			sanitized = sanitized.substring(0, 100).replace(/[.-]+$/, "");
		}

		if (!sanitized) {
			sanitized = "project";
		}

		return sanitized;
	}
}
