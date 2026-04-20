export const REPORTS_TYPE = {
	ReportsController: Symbol.for("ReportsController"),
	IReportsRepository: Symbol.for("IReportsRepository"),
	GetProjectReportsUseCase: Symbol.for("GetProjectReportsUseCase"),
	GetSprintReportsUseCase: Symbol.for("GetSprintReportsUseCase"),
	GetUserStoryReportsUseCase: Symbol.for("GetUserStoryReportsUseCase"),
	GetSubtaskReportsUseCase: Symbol.for("GetSubtaskReportsUseCase"),
	GetUserPerformanceReportsUseCase: Symbol.for(
		"GetUserPerformanceReportsUseCase",
	),
};
