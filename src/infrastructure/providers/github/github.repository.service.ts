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

			let response: { data: Record<string, unknown> };

			if (organization) {
				response = (await octokit.rest.repos.createInOrg({
					org: organization,
					name: sanitizedName,
					description: description,
					private: isPrivate,
					auto_init: true,
				})) as unknown as { data: Record<string, unknown> };
			} else {
				response = (await octokit.rest.repos.createForAuthenticatedUser({
					name: sanitizedName,
					description: description,
					private: isPrivate,
					auto_init: true,
				})) as unknown as { data: Record<string, unknown> };
			}

			const repo = response.data;

			return {
				name: repo.name as string,
				fullName: repo.full_name as string,
				htmlUrl: repo.html_url as string,
				cloneUrl: repo.clone_url as string,
				sshUrl: repo.ssh_url as string,
				isPrivate: repo.private as boolean,
				description: (repo.description as string) || "",
			};
		} catch (error: unknown) {
			const err = error as { message: string };
			throw new Error(`Failed to create repository: ${err.message}`);
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
		} catch (error: unknown) {
			const err = error as { message: string };
			throw new Error(`Failed to get repository: ${err.message}`);
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
		} catch (error: unknown) {
			const err = error as { message: string };
			throw new Error(`Failed to delete repository: ${err.message}`);
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
