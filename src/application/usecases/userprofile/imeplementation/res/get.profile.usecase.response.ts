export interface GetMyProfileResponse {
	id: string;
	userId: string;
	companyId: string;
	phoneNumber?: string;
	address?: string;
	bio?: string;
	skills: string[];
	avatarUrl?: string;
	linkedin?: string;
	github?: string;
}