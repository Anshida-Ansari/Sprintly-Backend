export const ADMIN_TYPES = {
	AdminController: Symbol.for("AdminController"),
	IInviteMemberUseCase: Symbol.for("IInviteMemberUseCase"),
	AuthGuard: Symbol.for("AuthGuard"),
	IVerifyInvitationUseCase: Symbol.for("IVerifyInvitationUseCase"),
	IListMembersUseCase: Symbol.for("IListMembersUseCase"),
	IBlockUserUseCase: Symbol.for("IBlockUserUseCase"),
	IGetDashboardStatsUseCase: Symbol.for("IGetDashboardStatsUseCase"),
	IUpgradeSubscriptionUseCase: Symbol.for("IUpgradeSubscriptionUseCase"),
	ICreateStripeSessionUseCase: Symbol.for("ICreateStripeSessionUseCase"),
	IHandleStripeWebhookUseCase: Symbol.for("IHandleStripeWebhookUseCase"),
	IGetCompanySubscriptionUseCase: Symbol.for("IGetCompanySubscriptionUseCase"),
	IVerifyStripeSessionUseCase: Symbol.for("IVerifyStripeSessionUseCase"),
};
