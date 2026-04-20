import { AddAttachementes } from "@application/usecases/subtask/implementation/add.attachements";
import { AddCommentToSubTaskUseCase } from "@application/usecases/subtask/implementation/add.comment.to.subtask.usecase";
import { AssignSubtaskUseCase } from "@application/usecases/subtask/implementation/assign.subtask.usecase";
import { CreateSubTaskUseCase } from "@application/usecases/subtask/implementation/create.subtask.usecase";
import { DeleteSubtaskUseCase } from "@application/usecases/subtask/implementation/delete.subtask.usecase";
import { GenerateDownloadUrlUseCase } from "@application/usecases/subtask/implementation/generate.download.url.usecase";
import { GenrateUploadUrlUseCase } from "@application/usecases/subtask/implementation/generate.upload.url.usecase";
import { ListSubtasksByStoryUseCase } from "@application/usecases/subtask/implementation/list.subtask.usecase";
import { UpdateSubtaskStatusUseCase } from "@application/usecases/subtask/implementation/update.subtask.status.usecase";
import { UpdateSubtaskTimeUseCase } from "@application/usecases/subtask/implementation/update.subtask.time.usecase";
import type { IAddAttachementsUseCase } from "@application/usecases/subtask/interface/add.attachements.interface";
import type { IAddCommentToSubtaskUseCase } from "@application/usecases/subtask/interface/add.comment.to.subtask.interface";
import type { IAssignSubtaskUseCase } from "@application/usecases/subtask/interface/assign.subtask.interface";
import type { ICreateSubTaskUseCase } from "@application/usecases/subtask/interface/create.subtask.interface";
import type { IDeleteSubtaskUseCase } from "@application/usecases/subtask/interface/delete.subtask.interface";
import type { IGenerateDownloadUrlUseCase } from "@application/usecases/subtask/interface/generate.download.url.interface";
import type { IGenerateUploadURLUseCase } from "@application/usecases/subtask/interface/generate.upload.url.interface";
import type { IListSubtasksByStoryUseCase } from "@application/usecases/subtask/interface/list.subtask.interface";
import type { IUpdateSubtaskStatusUseCase } from "@application/usecases/subtask/interface/update.subtask.status.interface";
import type { IUpdateSubtaskTimeUseCase } from "@application/usecases/subtask/interface/update.subtask.time.interface";
import type { IStorageService } from "@domain/interface/storage.service.interface";
import type { ISubtTask } from "@infrastructure/db/interface/subtask.interface";
import { SubTaskModel } from "@infrastructure/db/models/subtask.model";
import { SubtaskRepository } from "@infrastructure/db/repository/implements/subtask.repository";
import type { ISubTaskRepository } from "@infrastructure/db/repository/interface/subtask.interface";
import { SUBTASK_TYPE } from "@infrastructure/di/types/subtask/subtask";
import { SubTaskPersisitanceMapper } from "@infrastructure/mappers/subtask.mapper";
import { StorageService } from "@infrastructure/providers/S3-bucket/storage.service";
import { SubTaskController } from "@presentation/http/controllers/subtask.controller";
import { ContainerModule } from "inversify";
import type { Model } from "mongoose";

export const SubtaskModule = new ContainerModule(({ bind }) => {
	bind<Model<ISubtTask>>(SUBTASK_TYPE.SubTaskModel).toConstantValue(
		SubTaskModel,
	);
	bind<SubTaskPersisitanceMapper>(SUBTASK_TYPE.SubTaskPersisitanceMapper).to(
		SubTaskPersisitanceMapper,
	);
	bind<ISubTaskRepository>(SUBTASK_TYPE.ISubTaskRepository).to(
		SubtaskRepository,
	);
	bind<ICreateSubTaskUseCase>(SUBTASK_TYPE.ICreateSubTaskUseCase).to(
		CreateSubTaskUseCase,
	);
	bind<SubTaskController>(SUBTASK_TYPE.SubTaskController).to(SubTaskController);
	bind<IUpdateSubtaskStatusUseCase>(
		SUBTASK_TYPE.IUpdateSubtaskStatusUseCase,
	).to(UpdateSubtaskStatusUseCase);
	bind<IListSubtasksByStoryUseCase>(
		SUBTASK_TYPE.IListSubtasksByStoryUseCase,
	).to(ListSubtasksByStoryUseCase);
	bind<IAssignSubtaskUseCase>(SUBTASK_TYPE.IAssignSubtaskUseCase).to(
		AssignSubtaskUseCase,
	);
	bind<IDeleteSubtaskUseCase>(SUBTASK_TYPE.IDeleteSubtaskUseCase).to(
		DeleteSubtaskUseCase,
	);
	bind<IAddCommentToSubtaskUseCase>(
		SUBTASK_TYPE.IAddCommentToSubtaskUseCase,
	).to(AddCommentToSubTaskUseCase);
	bind<IUpdateSubtaskTimeUseCase>(SUBTASK_TYPE.IUpdateSubtaskTimeUseCase).to(
		UpdateSubtaskTimeUseCase,
	);
	bind<IStorageService>(SUBTASK_TYPE.IStorageService).to(StorageService);
	bind<IGenerateUploadURLUseCase>(SUBTASK_TYPE.IGenerateUploadURLUseCase).to(
		GenrateUploadUrlUseCase,
	);
	bind<IAddAttachementsUseCase>(SUBTASK_TYPE.IAddAttachementsUseCase).to(
		AddAttachementes,
	);
	bind<IGenerateDownloadUrlUseCase>(
		SUBTASK_TYPE.IGenerateDownloadUrlUseCase,
	).to(GenerateDownloadUrlUseCase);
});
