export const SUBSCRIPTION_PLAN_TYPES = {
    ISubscriptionPlanRepository: Symbol.for("ISubscriptionPlanRepository"),
    SubscriptionPlanMapper: Symbol.for("SubscriptionPlanMapper"),
    ICreateSubscriptionPlanUseCase: Symbol.for("ICreateSubscriptionPlanUseCase"),
    IListSubscriptionPlansUseCase: Symbol.for("IListSubscriptionPlansUseCase"),
    IUpdateSubscriptionPlanUseCase: Symbol.for("IUpdateSubscriptionPlanUseCase"),
    IDeleteSubscriptionPlanUseCase: Symbol.for("IDeleteSubscriptionPlanUseCase"),
    IGetActiveSubscriptionPlansUseCase: Symbol.for("IGetActiveSubscriptionPlansUseCase"),
    SubscriptionPlanController: Symbol.for("SubscriptionPlanController"),
};
