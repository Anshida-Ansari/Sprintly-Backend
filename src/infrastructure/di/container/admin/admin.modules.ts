import { ContainerModule } from "inversify";
import { BlockUserUseCase } from "../../../../application/usecases/admin/implementation/block.user.usecase";
import { GetDashboardStatsUseCase } from "../../../../application/usecases/admin/implementation/get.dashboard.stats.usecase";
import { InviteMemberUseCase } from "../../../../application/usecases/admin/implementation/invite.member.usecase";
import { ListUserUseCase } from "../../../../application/usecases/admin/implementation/list.members.usecase";
import { VerifyInvitationUseCase } from "../../../../application/usecases/admin/implementation/verify.member.usecase";
import type { IBlockUserUseCase } from "../../../../application/usecases/admin/interface/block.user.interface";
import type { IGetDashboardStatsUseCase } from "../../../../application/usecases/admin/interface/get.dashboard.stats.interface";
import type { IInviteMemberUseCase } from "../../../../application/usecases/admin/interface/invite.member.interface";
import type { IListMembersUseCase } from "../../../../application/usecases/admin/interface/list.members.interface";
import type { IVerifyInvitationUseCase } from "../../../../application/usecases/admin/interface/verify.member.interface";
import { CreateStripeSessionUseCase } from "../../../../application/usecases/subscription/implementation/create.stripe.session.usecase";
import { GetCompanySubscriptionUseCase } from "../../../../application/usecases/subscription/implementation/get.company.subscription.usecase";
import { HandleStripeWebhookUseCase } from "../../../../application/usecases/subscription/implementation/handle.stripe.webhook.usecase";
import { UpgradeSubscriptionUseCase } from "../../../../application/usecases/subscription/implementation/upgrade.subscription.usecase";
import { VerifyStripeSessionUseCase } from "../../../../application/usecases/subscription/implementation/verify.stripe.session.usecase";
import type { ICreateStripeSessionUseCase } from "../../../../application/usecases/subscription/interface/create.stripe.session.interface";
import type { IGetCompanySubscriptionUseCase } from "../../../../application/usecases/subscription/interface/get.company.subscription.interface";
import type { IHandleStripeWebhookUseCase } from "../../../../application/usecases/subscription/interface/handle.stripe.webhook.interface";
import type { IUpgradeSubscriptionUseCase } from "../../../../application/usecases/subscription/interface/upgrade.subscription.interface";
import type { IVerifyStripeSessionUseCase } from "../../../../application/usecases/subscription/interface/verify.stripe.session.interface";
import { AuthGurd } from "../../../../presentation/express/middleware/auth.gurd";
import { AdminController } from "../../../../presentation/http/controllers/admin.controller";
import { ADMIN_TYPES } from "../../types/admin/admin.types";

export const InviteModule = new ContainerModule(({ bind }) => {
	bind<IInviteMemberUseCase>(ADMIN_TYPES.IInviteMemberUseCase).to(
		InviteMemberUseCase,
	);
	bind<AdminController>(ADMIN_TYPES.AdminController).to(AdminController);
	bind<AuthGurd>(ADMIN_TYPES.AuthGurd).to(AuthGurd);
	bind<IVerifyInvitationUseCase>(ADMIN_TYPES.IVerifyInvitationUseCase).to(
		VerifyInvitationUseCase,
	);
	bind<IListMembersUseCase>(ADMIN_TYPES.IListMembersUseCase).to(
		ListUserUseCase,
	);
	bind<IBlockUserUseCase>(ADMIN_TYPES.IBlockUserUseCase).to(BlockUserUseCase);
	bind<IGetDashboardStatsUseCase>(ADMIN_TYPES.IGetDashboardStatsUseCase).to(
		GetDashboardStatsUseCase,
	);

	// Subscription UseCases
	bind<IUpgradeSubscriptionUseCase>(ADMIN_TYPES.IUpgradeSubscriptionUseCase).to(
		UpgradeSubscriptionUseCase,
	);
	bind<ICreateStripeSessionUseCase>(ADMIN_TYPES.ICreateStripeSessionUseCase).to(
		CreateStripeSessionUseCase,
	);
	bind<IHandleStripeWebhookUseCase>(ADMIN_TYPES.IHandleStripeWebhookUseCase).to(
		HandleStripeWebhookUseCase,
	);
	bind<IVerifyStripeSessionUseCase>(ADMIN_TYPES.IVerifyStripeSessionUseCase).to(
		VerifyStripeSessionUseCase,
	);
	bind<IGetCompanySubscriptionUseCase>(
		ADMIN_TYPES.IGetCompanySubscriptionUseCase,
	).to(GetCompanySubscriptionUseCase);
});
