export const USERSTORY_TYPE = {
	UserStoryModel: Symbol.for("UserStoryModel"),
	UserStoryPersisitanceMapper: Symbol.for("UserStoryPersisitanceMapper"),
	IUserStoryRepository: Symbol.for("IUserStoryRepository"),
	ICreateUserstoryUsecase: Symbol.for("ICreateUserstoryUsecase"),
	UserstoryController: Symbol.for("UserstoryController"),
	IEditUserstoryUseCase: Symbol.for("IEditUserstoryUseCase"),
	IListUserstoryUseCase: Symbol.for("IListUserstoryUseCase"),
	IAssignUserStoriesToSprintUseCase: Symbol.for(
		"IAssignUserStoriesToSprintUseCase",
	),
	IUpdateStatusOfUserStoryInterface: Symbol.for(
		"IUpdateStatusOfUserStoryInterface",
	),
	IGetMyUserStoriesUseCase: Symbol.for("IGetMyUserStoriesUseCase"),
	IAssignUserStoryUseCase: Symbol.for("IAssignUserStoryUseCase"),
	IAddCommentToUserStoryUseCase: Symbol.for("IAddCommentToUserStoryUseCase"),
};
