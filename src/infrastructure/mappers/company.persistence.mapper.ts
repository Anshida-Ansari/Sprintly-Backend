import { CompanyEntity } from "../../domain/entities/company.entity";
import type { Status } from "../../domain/enum/user/user.status.enum";

export class CompanyPersistenceMapper {
	toMongo(company: CompanyEntity) {
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
			currentPlan: company.currentPlan,
			projectLimit: company.projectLimit,
			stripeCustomerId: company.stripeCustomerId,
			stripeSubscriptionId: company.stripeSubscriptionId,
			subscriptionEndDate: company.subscriptionEndDate,
			autoRenew: company.autoRenew,
		};
	}

	// biome-ignore lint/suspicious/noExplicitAny: MongoDB document type
	fromMongo(doc: any): CompanyEntity {
		return CompanyEntity.create({
			id: (doc._id as { toString(): string } | undefined)?.toString(),
			companyName: doc.companyName as string,
			status: doc.status as Status,
			adminId:
				(doc.adminId as { toString(): string } | undefined)?.toString() ?? "",
			createdAt: doc.createdAt as unknown as Date,
			githubAccessToken: doc.githubAccessToken as string,
			githubRefreshToken: doc.githubRefreshToken as string,
			githubInstallationId: doc.githubInstallationId as string,
			githubConnectedAt: doc.githubConnectedAt as Date,
			githubUsername: doc.githubUsername as string,
			githubOrganization: doc.githubOrganization as string,
			currentPlan: (doc.currentPlan as string) || "free",
			projectLimit: (doc.projectLimit as number) ?? 2,
			stripeCustomerId: (doc.stripeCustomerId as string) ?? undefined,
			stripeSubscriptionId: (doc.stripeSubscriptionId as string) ?? undefined,
			subscriptionEndDate: (doc.subscriptionEndDate as Date) ?? undefined,
			autoRenew: (doc.autoRenew as boolean) ?? true,
		});
	}
}
