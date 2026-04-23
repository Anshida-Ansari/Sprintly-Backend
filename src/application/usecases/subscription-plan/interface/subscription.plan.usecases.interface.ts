import type { SubscriptionPlanEntity } from "../../../../domain/entities/subscription.plan.entity.js";

export interface ICreateSubscriptionPlanUseCase {
	execute(data: {
		name: string;
		price: number;
		stripePriceId?: string;
		projectLimit: number;
		features: Array<{ text: string; included: boolean }>;
		isActive: boolean;
		isPopular?: boolean;
	}): Promise<SubscriptionPlanEntity>;
}

export interface IListSubscriptionPlansUseCase {
	execute(onlyActive?: boolean): Promise<SubscriptionPlanEntity[]>;
}

export interface IUpdateSubscriptionPlanUseCase {
	execute(
		id: string,
		data: Partial<{
			name: string;
			price: number;
			stripePriceId: string;
			projectLimit: number;
			features: Array<{ text: string; included: boolean }>;
			isActive: boolean;
			isPopular: boolean;
		}>,
	): Promise<SubscriptionPlanEntity>;
}

export interface IDeleteSubscriptionPlanUseCase {
	execute(id: string): Promise<boolean>;
}
