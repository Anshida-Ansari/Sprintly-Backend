export const STANDUP_TYPES = {
	StandupModel: Symbol.for("StandupModel"),
	IStandupRepository: Symbol.for("IStandupRepository"),
	StandupPersistanceMapper: Symbol.for("StandupPersistanceMapper"),
	IAddStandupCommentUseCase: Symbol.for("IAddStandupCommentUseCase"),
	ISubmitStandupUseCase: Symbol.for("ISubmitStandupUseCase"),
	StandupController: Symbol.for("StandupController"),
	IListStandupsUseCase: Symbol.for("IListStandupsUseCase"),
	IGetTodayStandupUseCase: Symbol.for("IGetTodayStandupUseCase"),
};
