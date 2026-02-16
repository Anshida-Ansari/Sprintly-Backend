import { CompanyEnitiy } from "../../domain/entities/company.enities";

export class CompanyPersistenceMapper {
	toMongo(company: CompanyEnitiy) {
		return {
			companyName: company.companyName,
			status: company.status,
			adminId: company.adminId,
			githubAccessToken: company.githubAccessToken,
			githubRefreshToken: company.githubRefreshToken,
			githubInstallationId: company.githubInstallationId,
			githubConnectedAt: company.githubConnectedAt,
			githubUsername: company.githubUsername,
			githubOrganization: company.githubOrganization,
		};
	}

	fromMongo(doc: any): CompanyEnitiy {
		return CompanyEnitiy.create({
			id: doc._id?.toString(),
			companyName: doc.companyName,
			status: doc.status,
			adminId: doc.adminId?.toString(),
			createdAt: doc.createdAt,
			githubAccessToken: doc.githubAccessToken,
			githubRefreshToken: doc.githubRefreshToken,
			githubInstallationId: doc.githubInstallationId,
			githubConnectedAt: doc.githubConnectedAt,
			githubUsername: doc.githubUsername,
			githubOrganization: doc.githubOrganization,
		});
	}
}
