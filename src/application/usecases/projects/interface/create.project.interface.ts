import type { CreateProjectDTO } from "@application/dtos/projects/create.project.dto";
import type { CreateProjectResponse } from "@application/usecases/projects/implementation/res/create.project.response";

export interface ICreateProjectUseCase {
	execute(
		dto: CreateProjectDTO,
		adminId: string,
		companyId: string,
	): Promise<CreateProjectResponse>;
}
