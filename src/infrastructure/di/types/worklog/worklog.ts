export const WORKLOG_TYPE = {
	WorkLogModel: Symbol.for("WorkLogModel"),
	WorkLogMapper: Symbol.for("WorkLogMapper"),
	IWorkLogRepository: Symbol.for("IWorkLogRepository"),
	ICreateWorkLogUseCase: Symbol.for("ICreateWorkLogUseCase"),
	IGetUserWorkLogsUseCase: Symbol.for("IGetUserWorkLogsUseCase"),
	IGetAdminWorkLogsUseCase: Symbol.for("IGetAdminWorkLogsUseCase"),
	WorkLogController: Symbol.for("WorkLogController"),
};
