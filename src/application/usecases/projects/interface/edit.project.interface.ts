import type { EditProjectDTO } from "src/application/dtos/projects/edit.project.dto";
import type { EditProjectResponse } from "../implementation/res/edit.project.response";

export interface IEditProjectUsecase {
	execute(
		projectId: string,
		dto: EditProjectDTO,
		adminId: string,
		companyId: string,
	): Promise<EditProjectResponse>;
}
