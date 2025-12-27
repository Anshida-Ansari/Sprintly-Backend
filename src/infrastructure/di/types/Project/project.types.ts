import { CreateProjectUseCase } from "src/application/usecases/projects/implementation/create.project.usecase";
import { ListProjectUseCase } from "src/application/usecases/projects/implementation/list.project.usecase";
import { ProjectController } from "src/presentation/http/controllers/project.controller";

export const PROJECT_TYPE = {
    ProjectController: Symbol.for("ProjectController"),
    IProjectRepository: Symbol.for("IProjectRepository"),
    ProjectModel: Symbol.for('ProjectModel'),
    ProjectPersistanceMapper: Symbol.for('ProjectPersistanceMapper'),
    CreateProjectUseCase: Symbol.for('CreateProjectUseCase'),
    IListProjectUseCase: Symbol.for('IListProjectUseCase '),
    IEditProjectUsecase: Symbol.for('IEditProjectUsecase'),
    IGetDetailProjectUseCase: Symbol.for('IGetDetailProjectUseCase')

    
}