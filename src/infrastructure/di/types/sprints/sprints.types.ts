export const SPRINTS_TYPE = {
	SprintModel: Symbol.for("SprintModel"),
	ISprintRepository: Symbol.for("ISprintRepository"),
	SprintPersistenceMapper: Symbol.for("SprintPersistenceMapper"),
	ICreateSprintUseCase: Symbol.for("ICreateSprintUseCase"),
	SprintController: Symbol.for("SprintController"),
	IListSprintsUseCase: Symbol.for("IListSprintsUseCase"),
	IEditSprintUseCase: Symbol.for("IEditSprintUseCase"),
	IStartSprintUseCase: Symbol.for("IStartSprintUseCase"),
	ICompleteSprintUseCase: Symbol.for("ICompleteSprintUseCase"),
	IDeleteSprintUseCase: Symbol.for("IDeleteSprintUseCase"),
};
