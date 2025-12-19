import { ContainerModule } from "inversify";
import { IProjectReposiotory } from "src/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "../../types/Project/project.types";
import { ProjectRepository } from "src/infrastructure/db/repository/implements/project.reposioty";
import { IProject } from "src/infrastructure/db/interface/project.interface";
import { ProjectModel } from "src/infrastructure/db/models/project.model";
import { ProjectPersistanceMapper } from "src/infrastructure/mappers/project.mapper";
import { Model } from "mongoose";

export const ProjectModule = new ContainerModule(({bind})=>{
    bind<IProjectReposiotory>(PROJECT_TYPE.IProjectRepository).to(ProjectRepository)
    bind<Model<IProject>>(PROJECT_TYPE.ProjectModel).toConstantValue(ProjectModel)
    bind<ProjectPersistanceMapper>(PROJECT_TYPE.ProjectPersistanceMapper).to(ProjectPersistanceMapper)

})