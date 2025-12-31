import { ContainerModule } from "inversify";
import type { Model } from "mongoose";
import { CreateProjectUseCase } from "../../../../application/usecases/projects/implementation/create.project.usecase";
import { EditProjectUseCase } from "../../../../application/usecases/projects/implementation/edit.project.usecase";
import { GetDetailProjectUseCase } from "../../../../application/usecases/projects/implementation/get.detail.project.usecase";
import { ListProjectUseCase } from "../../../../application/usecases/projects/implementation/list.project.usecase";
import type { ICreateProjectUseCase } from "../../../../application/usecases/projects/interface/create.project.interface";
import type { IEditProjectUsecase } from "../../../../application/usecases/projects/interface/edit.project.interface";
import type { IGetDetailProjectUseCase } from "../../../../application/usecases/projects/interface/get.detail.project.interface";
import type { IListProjectUseCase } from "../../../../application/usecases/projects/interface/list.project.interface";
import type { IProject } from "../../../db/interface/project.interface";
import { ProjectModel } from "../../../db/models/project.model";
import { ProjectRepository } from "../../../db/repository/implements/project.reposioty";
import type { IProjectReposiotory } from "../../../db/repository/interface/project.interface";
import { ProjectPersistanceMapper } from "../../../mappers/project.mapper";
import { ProjectController } from "../../../../presentation/http/controllers/project.controller";
import { PROJECT_TYPE } from "../../types/Project/project.types";

export const ProjectModule = new ContainerModule(({ bind }) => {
	bind<IProjectReposiotory>(PROJECT_TYPE.IProjectRepository).to(
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
});
