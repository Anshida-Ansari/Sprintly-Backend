import type { CreateProjectDTO } from "../../../dtos/projects/create.project.dto";
import type { CreateProjectResponse } from "../implementation/res/create.project.response";

export interface ICreateProjectUseCase {
	execute(
		dto: CreateProjectDTO,
		adminId: string,
		companyId: string,
	): Promise<CreateProjectResponse>;
}
