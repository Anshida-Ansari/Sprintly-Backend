import { CreateWorkLogUseCase } from "@application/usecases/worklog/implementation/create.worklog.usecase";
import { GetAdminWorkLogsUseCase } from "@application/usecases/worklog/implementation/get.admin.worklogs.usecase";
import { GetUserWorkLogsUseCase } from "@application/usecases/worklog/implementation/get.user.worklogs.usecase";
import type {
	ICreateWorkLogUseCase,
	IGetAdminWorkLogsUseCase,
	IGetUserWorkLogsUseCase,
} from "@application/usecases/worklog/interface/worklog.usecase.interface";
import type { IWorkLog } from "@infrastructure/db/interface/worklog.interface";
import { WorkLogModel } from "@infrastructure/db/models/worklog.model";
import { WorkLogRepository } from "@infrastructure/db/repository/implements/worklog.repository";
import type { IWorkLogRepository } from "@infrastructure/db/repository/interface/worklog.interface";
import { WORKLOG_TYPE } from "@infrastructure/di/types/worklog/worklog";
import { WorkLogMapper } from "@infrastructure/mappers/worklog.mapper";
import { WorkLogController } from "@presentation/http/controllers/worklog.controller";
import { ContainerModule } from "inversify";
import type { Model } from "mongoose";

export const WorkLogModule = new ContainerModule(({ bind }) => {
	bind<Model<IWorkLog>>(WORKLOG_TYPE.WorkLogModel).toConstantValue(
		WorkLogModel,
	);
	bind<WorkLogMapper>(WORKLOG_TYPE.WorkLogMapper).to(WorkLogMapper);
	bind<IWorkLogRepository>(WORKLOG_TYPE.IWorkLogRepository).to(
		WorkLogRepository,
	);
	bind<ICreateWorkLogUseCase>(WORKLOG_TYPE.ICreateWorkLogUseCase).to(
		CreateWorkLogUseCase,
	);
	bind<IGetUserWorkLogsUseCase>(WORKLOG_TYPE.IGetUserWorkLogsUseCase).to(
		GetUserWorkLogsUseCase,
	);
	bind<IGetAdminWorkLogsUseCase>(WORKLOG_TYPE.IGetAdminWorkLogsUseCase).to(
		GetAdminWorkLogsUseCase,
	);
	bind<WorkLogController>(WORKLOG_TYPE.WorkLogController).to(WorkLogController);
});
