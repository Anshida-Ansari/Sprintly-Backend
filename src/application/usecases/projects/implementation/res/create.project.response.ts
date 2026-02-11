export interface CreateProjectResponse {
	id: string;
	name: string;
	description: string;
	startDate: Date;
	endDate: Date;
	gitRepoUrl?: string;
}
