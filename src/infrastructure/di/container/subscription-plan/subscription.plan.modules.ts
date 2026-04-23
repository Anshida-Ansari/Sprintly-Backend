import { ContainerModule } from "inversify";
import {
	CreateSubscriptionPlanUseCase,
	DeleteSubscriptionPlanUseCase,
	ListSubscriptionPlansUseCase,
	UpdateSubscriptionPlanUseCase,
} from "../../../../application/usecases/subscription-plan/implementation/subscription.plan.usecases.js";
import type {
	ICreateSubscriptionPlanUseCase,
	IDeleteSubscriptionPlanUseCase,
	IListSubscriptionPlansUseCase,
	IUpdateSubscriptionPlanUseCase,
} from "../../../../application/usecases/subscription-plan/interface/subscription.plan.usecases.interface.js";
import { SubscriptionPlanController } from "../../../../presentation/http/controllers/subscription.plan.controller.js";
import { SubscriptionPlanRepository } from "../../../db/repository/implements/subscription.plan.repository.js";
import type { ISubscriptionPlanRepository } from "../../../db/repository/interface/subscription.plan.interface.js";
import { SubscriptionPlanMapper } from "../../../mappers/subscription.plan.mapper.js";
import { SUBSCRIPTION_PLAN_TYPES } from "../../types/subscription-plan/subscription.plan.types.js";

export const SubscriptionPlanModule = new ContainerModule(({ bind }) => {
	// Mapper
	bind(SUBSCRIPTION_PLAN_TYPES.SubscriptionPlanMapper).to(
		SubscriptionPlanMapper,
	);

	// Repository
	bind<ISubscriptionPlanRepository>(
		SUBSCRIPTION_PLAN_TYPES.ISubscriptionPlanRepository,
	).to(SubscriptionPlanRepository);

	// Use Cases
	bind<ICreateSubscriptionPlanUseCase>(
		SUBSCRIPTION_PLAN_TYPES.ICreateSubscriptionPlanUseCase,
	).to(CreateSubscriptionPlanUseCase);
	bind<IListSubscriptionPlansUseCase>(
		SUBSCRIPTION_PLAN_TYPES.IListSubscriptionPlansUseCase,
	).to(ListSubscriptionPlansUseCase);
	bind<IUpdateSubscriptionPlanUseCase>(
		SUBSCRIPTION_PLAN_TYPES.IUpdateSubscriptionPlanUseCase,
	).to(UpdateSubscriptionPlanUseCase);
	bind<IDeleteSubscriptionPlanUseCase>(
		SUBSCRIPTION_PLAN_TYPES.IDeleteSubscriptionPlanUseCase,
	).to(DeleteSubscriptionPlanUseCase);

	// Controller
	bind<SubscriptionPlanController>(
		SUBSCRIPTION_PLAN_TYPES.SubscriptionPlanController,
	).to(SubscriptionPlanController);
});
