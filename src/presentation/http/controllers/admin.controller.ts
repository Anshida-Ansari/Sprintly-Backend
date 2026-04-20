import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { IBlockUserUseCase } from "../../../application/usecases/admin/interface/block.user.interface";
import type { IGetDashboardStatsUseCase } from "../../../application/usecases/admin/interface/get.dashboard.stats.interface";
import type { IInviteMemberUseCase } from "../../../application/usecases/admin/interface/invite.member.interface";
import type { IListMembersUseCase } from "../../../application/usecases/admin/interface/list.members.interface";
import type { IVerifyInvitationUseCase } from "../../../application/usecases/admin/interface/verify.member.interface";
import type { ICreateStripeSessionUseCase } from "../../../application/usecases/subscription/interface/create.stripe.session.interface";
import type { IGetCompanySubscriptionUseCase } from "../../../application/usecases/subscription/interface/get.company.subscription.interface";
import type { IHandleStripeWebhookUseCase } from "../../../application/usecases/subscription/interface/handle.stripe.webhook.interface";
import type { IUpgradeSubscriptionUseCase } from "../../../application/usecases/subscription/interface/upgrade.subscription.interface";
import type { IVerifyStripeSessionUseCase } from "../../../application/usecases/subscription/interface/verify.stripe.session.interface";
import { ErrorMessage } from "../../../domain/enum/messages/error.message.enum";
import { ClientErrorStatus } from "../../../domain/enum/status-codes/client.error.status.enum";
import { SuccessStatus } from "../../../domain/enum/status-codes/success.status.enum";
import { ADMIN_TYPES } from "../../../infrastructure/di/types/admin/admin.types";

@injectable()
export class AdminController {
	constructor(
		@inject(ADMIN_TYPES.IInviteMemberUseCase)
		private _inviteMemberUseCase: IInviteMemberUseCase,
		@inject(ADMIN_TYPES.IVerifyInvitationUseCase)
		private _verifyInvitationUseCase: IVerifyInvitationUseCase,
		@inject(ADMIN_TYPES.IListMembersUseCase)
		private _listUserUseCase: IListMembersUseCase,
		@inject(ADMIN_TYPES.IBlockUserUseCase)
		private _blockUserUseCase: IBlockUserUseCase,
		@inject(ADMIN_TYPES.IGetDashboardStatsUseCase)
		private _getDashboardStatsUseCase: IGetDashboardStatsUseCase,
		@inject(ADMIN_TYPES.IUpgradeSubscriptionUseCase)
		private _upgradeSubscriptionUseCase: IUpgradeSubscriptionUseCase,
		@inject(ADMIN_TYPES.ICreateStripeSessionUseCase)
		private _createStripeSessionUseCase: ICreateStripeSessionUseCase,
		@inject(ADMIN_TYPES.IHandleStripeWebhookUseCase)
		private _handleStripeWebhookUseCase: IHandleStripeWebhookUseCase,
		@inject(ADMIN_TYPES.IGetCompanySubscriptionUseCase)
		private _getCompanySubscriptionUseCase: IGetCompanySubscriptionUseCase,
		@inject(ADMIN_TYPES.IVerifyStripeSessionUseCase)
		private _verifyStripeSessionUseCase: IVerifyStripeSessionUseCase,
	) {}

	async inviteMember(req: Request, res: Response, next: NextFunction) {
		try {
			console.log("reaching the controller");

			const companyId = req.user.companyId;
			const adminId = req.user.id;

			if (!companyId) {
				throw new NotFoundError(ErrorMessage.COMPANY_NOT_FOUND);
			}

			if (!adminId) {
				throw new NotFoundError(ErrorMessage.ADMIN_NOT_FOUND);
			}

			const result = await this._inviteMemberUseCase.execute(
				req.body,
				companyId,
				adminId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: result.message,
				inviteLink: result.inviteLink,
			});
		} catch (error) {
			next(error);
		}
	}

	async verifyInvitation(req: Request, res: Response, next: NextFunction) {
		try {
			console.log("reaching the verify");

			const { token } = req.body;
			console.log(token);

			if (!token) {
				return res.status(ClientErrorStatus.BAD_REQUEST).json({
					success: false,
					message: "Tocken is Expired",
				});
			}

			const data = await this._verifyInvitationUseCase.execute(token);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data: data,
			});
		} catch (error) {
			next(error);
		}
	}

	async listUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			if (!companyId) {
				return res.status(ClientErrorStatus.NOT_FOUND).json({
					success: false,
					message: ErrorMessage.COMPANY_NOT_FOUND,
				});
			}

			const { page, limit, search } = req.query;

			const query = {
				page: page ? Number(page) : 1,
				limit: limit ? Number(limit) : 10,
				search: search ? String(search) : "",
			};

			const response = await this._listUserUseCase.execute(companyId, query);
			return res.status(SuccessStatus.OK).json({
				success: true,
				...response,
			});
		} catch (error: unknown) {
			next(error);
		}
	}

	async blockUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const { status } = req.body;

			const result = await this._blockUserUseCase.execute(userId, status);

			return res.status(SuccessStatus.OK).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}

	async getDashboardStats(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			if (!companyId) {
				return res.status(ClientErrorStatus.NOT_FOUND).json({
					success: false,
					message: ErrorMessage.COMPANY_NOT_FOUND,
				});
			}

			const stats = await this._getDashboardStatsUseCase.execute(companyId);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	}

	async upgradePlan(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			if (!companyId) {
				return res.status(ClientErrorStatus.NOT_FOUND).json({
					success: false,
					message: ErrorMessage.COMPANY_NOT_FOUND,
				});
			}

			const result = await this._upgradeSubscriptionUseCase.execute(companyId);

			return res.status(SuccessStatus.OK).json({
				success: true,
				...result,
			});
		} catch (error) {
			next(error);
		}
	}

	async createStripeSession(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const { priceId } = req.body;
			if (!companyId) {
				return res.status(ClientErrorStatus.NOT_FOUND).json({
					success: false,
					message: ErrorMessage.COMPANY_NOT_FOUND,
				});
			}

			const result = await this._createStripeSessionUseCase.execute(
				companyId,
				priceId,
			);

			return res.status(SuccessStatus.OK).json({
				success: true,
				...result,
			});
		} catch (error) {
			next(error);
		}
	}

	async stripeWebhook(req: Request, res: Response, _next: NextFunction) {
		try {
			const signature = req.headers["stripe-signature"] as string;

			// We need the raw body as a buffer for signature verification.
			// This typically requires a custom body parser middleware specifically for this route.
			const rawBody = req.body;

			await this._handleStripeWebhookUseCase.execute(rawBody, signature);

			return res.status(SuccessStatus.OK).json({ received: true });
		} catch (error) {
			// Stripe expects an error response if webhook handling fails
			console.error("Webhook processing error:", error);
			return res
				.status(ClientErrorStatus.BAD_REQUEST)
				.send(`Webhook Error: ${error}`);
		}
	}

	async verifyStripeSession(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			const { sessionId } = req.body;

			if (!companyId) {
				return res.status(ClientErrorStatus.NOT_FOUND).json({
					success: false,
					message: ErrorMessage.COMPANY_NOT_FOUND,
				});
			}

			if (!sessionId) {
				return res.status(ClientErrorStatus.BAD_REQUEST).json({
					success: false,
					message: "Session ID is required",
				});
			}

			const result = await this._verifyStripeSessionUseCase.execute(
				sessionId,
				companyId,
			);

			return res.status(SuccessStatus.OK).json({
				...result,
			});
		} catch (error) {
			next(error);
		}
	}

	async getSubscriptionStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const companyId = req.user.companyId;
			if (!companyId) {
				return res.status(ClientErrorStatus.NOT_FOUND).json({
					success: false,
					message: ErrorMessage.COMPANY_NOT_FOUND,
				});
			}

			const stats =
				await this._getCompanySubscriptionUseCase.execute(companyId);

			return res.status(SuccessStatus.OK).json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	}
}
