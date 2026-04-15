import { SubscriptionPlan } from "../../domain/enum/company/subscription.plan.enum";
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
			currentPlan: company.currentPlan,
			projectLimit: company.projectLimit,
			stripeCustomerId: company.stripeCustomerId,
			stripeSubscriptionId: company.stripeSubscriptionId,
			subscriptionEndDate: company.subscriptionEndDate,
			autoRenew: company.autoRenew,
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
			currentPlan: doc.currentPlan as SubscriptionPlan ?? SubscriptionPlan.FREE,
			projectLimit: doc.projectLimit ?? 2,
			stripeCustomerId: doc.stripeCustomerId ?? undefined,
			stripeSubscriptionId: doc.stripeSubscriptionId ?? undefined,
			subscriptionEndDate: doc.subscriptionEndDate ?? undefined,
			autoRenew: doc.autoRenew ?? true,
		});
	}
}
