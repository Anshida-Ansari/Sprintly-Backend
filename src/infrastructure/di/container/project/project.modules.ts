import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import { AddMemberToProjectUseCase } from "../../../../application/usecases/projects/implementation/add.member.project.usecase.js";
import { CreateProjectUseCase } from "../../../../application/usecases/projects/implementation/create.project.usecase.js";
import { EditProjectUseCase } from "../../../../application/usecases/projects/implementation/edit.project.usecase.js";
import { GetDetailProjectUseCase } from "../../../../application/usecases/projects/implementation/get.detail.project.usecase.js";
import { ListProjectUseCase } from "../../../../application/usecases/projects/implementation/list.project.usecase.js";
import type { IAddMemberToProjectUseCase } from "../../../../application/usecases/projects/interface/add.member.project.interface.js";
import type { ICreateProjectUseCase } from "../../../../application/usecases/projects/interface/create.project.interface.js";
import type { IEditProjectUsecase } from "../../../../application/usecases/projects/interface/edit.project.interface.js";
import type { IGetDetailProjectUseCase } from "../../../../application/usecases/projects/interface/get.detail.project.interface.js";
import type { IListProjectUseCase } from "../../../../application/usecases/projects/interface/list.project.interface.js";
import { ProjectController } from "../../../../presentation/http/controllers/project.controller.js";
import type { IProject } from "../../../db/interface/project.interface.js";
import { ProjectModel } from "../../../db/models/project.model.js";
import { ProjectRepository } from "../../../db/repository/implements/project.repository.js";
import type { IProjectRepository } from "../../../db/repository/interface/project.interface.js";
import { ProjectPersistanceMapper } from "../../../mappers/project.mapper.js";
import { PROJECT_TYPE } from "../../types/Project/project.types.js";

export const ProjectModule = new ContainerModule(({ bind }) => {
	bind<IProjectRepository>(PROJECT_TYPE.IProjectRepository).to(
		ProjectRepository,
	);
	bind<Model<IProject>>(PROJECT_TYPE.ProjectModel).toConstantValue(
		ProjectModel,
	);
	bind<ProjectPersistanceMapper>(PROJECT_TYPE.ProjectPersistanceMapper).to(
		ProjectPersistanceMapper,
	);
	bind<ICreateProjectUseCase>(PROJECT_TYPE.CreateProjectUseCase).to(
		CreateProjectUseCase,
	);
	bind<ProjectController>(PROJECT_TYPE.ProjectController).to(ProjectController);
	bind<IListProjectUseCase>(PROJECT_TYPE.IListProjectUseCase).to(
		ListProjectUseCase,
	);
	bind<IEditProjectUsecase>(PROJECT_TYPE.IEditProjectUsecase).to(
		EditProjectUseCase,
	);
	bind<IGetDetailProjectUseCase>(PROJECT_TYPE.IGetDetailProjectUseCase).to(
		GetDetailProjectUseCase,
	);
	bind<IAddMemberToProjectUseCase>(PROJECT_TYPE.AddMemberToProjectUseCase).to(
		AddMemberToProjectUseCase,
	);
});
