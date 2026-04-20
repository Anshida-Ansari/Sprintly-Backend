import type { IGetDetailProjectUseCase } from "@application/usecases/projects/interface/get.detail.project.interface";

import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import type { ProjectStatus } from "@domain/enum/project/project.status";

import type { IProjectRepository } from "@infrastructure/db/repository/interface/project.interface";
import type { ISprintRepository } from "@infrastructure/db/repository/interface/sprints.interface";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";

@injectable()
export class GetDetailProjectUseCase implements IGetDetailProjectUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectrepsository: IProjectRepository,
		@inject(SPRINTS_TYPE.ISprintRepository)
		private _sprintRepository: ISprintRepository,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(
		companyId: string,
		proejctId: string,
	): Promise<{
		id: string;
		name: string;
		description?: string;
		status: ProjectStatus;
		startDate?: Date;
		endDate?: Date;
		gitRepoUrl?: string;
		members?: {
			id: string;
			name: string;
			email: string;
			role: string;
		}[];
		createdAt: Date;
		updatedAt: Date;
		activeSprintId?: string;
	}> {
		const project = await this._projectrepsository.findById(proejctId);

		if (!project) {
			throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND);
		}

		if (project.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		const sprints = await this._sprintRepository.findByProject(
			proejctId,
			companyId,
		);
		const activeSprint = sprints.find((s) => s.status === "ACTIVE");

		let detailedMembers: {
			id: string;
			name: string;
			email: string;
			role: string;
		}[] = [];

		if (project.members && project.members.length > 0) {
			try {
				const memberPromises = project.members.map((memberId) =>
					this._userRepository.findById(memberId),
				);
				const members = await Promise.all(memberPromises);
				detailedMembers = members
					.filter((m): m is Exclude<typeof m, null> => m !== null)
					.map((m) => ({
						id: m.id ?? "",
						name: m.name,
						email: m.email,
						role: m.role,
					}));
			} catch (error) {
				console.error("Error fetching project members", error);
			}
		}

		if (!project.id) {
			throw new Error("Project ID is missing");
		}

		return {
			id: project.id,
			name: project.name,
			description: project.description,
			status: project.status,
			startDate: project.startDate,
			endDate: project.endDate,
			gitRepoUrl: project.gitRepoUrl,
			members: detailedMembers,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt ?? new Date(),
			activeSprintId: activeSprint ? activeSprint.id : undefined,
		};
	}
}
