import { ContainerModule } from "inversify";
import { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "../../types/Project/project.types";
import { ProjectRepository } from "src/infrastructure/db/repository/implements/project.reposioty";
import { IProject } from "src/infrastructure/db/interface/project.interface";
import { ProjectModel } from "src/infrastructure/db/models/project.model";
import { ProjectPersistanceMapper } from "src/infrastructure/mappers/project.mapper";
import { Model } from "mongoose";
import { ICreateProjectUseCase } from "src/application/usecases/projects/interface/create.project.interface";
import { CreateProjectUseCase } from "src/application/usecases/projects/implementation/create.project.usecase";
import { ProjectController } from "src/presentation/http/controllers/project.controller";
import { IListProjectUseCase } from "src/application/usecases/projects/interface/list.project.interface";
import { ListProjectUseCase } from "src/application/usecases/projects/implementation/list.project.usecase";
import { IEditProjectUsecase } from "src/application/usecases/projects/interface/edit.project.interface";
import { EditProjectUseCase } from "src/application/usecases/projects/implementation/edit.project.usecase";

export const ProjectModule = new ContainerModule(({bind})=>{
    bind<IProjectReposiotory>(PROJECT_TYPE.IProjectRepository).to(ProjectRepository)
    bind<Model<IProject>>(PROJECT_TYPE.ProjectModel).toConstantValue(ProjectModel)
    bind<ProjectPersistanceMapper>(PROJECT_TYPE.ProjectPersistanceMapper).to(ProjectPersistanceMapper)
    bind<ICreateProjectUseCase>(PROJECT_TYPE.CreateProjectUseCase).to(CreateProjectUseCase)
    bind<ProjectController>(PROJECT_TYPE.ProjectController).to(ProjectController)
    bind<IListProjectUseCase>(PROJECT_TYPE.IListProjectUseCase).to(ListProjectUseCase)
    bind<IEditProjectUsecase>(PROJECT_TYPE.IEditProjectUsecase).to(EditProjectUseCase)

})