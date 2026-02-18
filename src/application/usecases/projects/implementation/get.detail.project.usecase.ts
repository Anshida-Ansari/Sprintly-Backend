import { inject, injectable } from "inversify";

import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import type { ProjectStatus } from "@domain/enum/project/project.status";

import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";

import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";

import type { IGetDetailProjectUseCase } from "@application/usecases/projects/interface/get.detail.project.interface";

import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import type { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import { USER_TYPES } from "@infrastructure/di/types/user/user.types";
import type { IUserRepository } from "@infrastructure/db/repository/interface/user.interface";

@injectable()
export class GetDetailProjectUseCase implements IGetDetailProjectUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectrepsository: IProjectReposiotory,
		@inject(SPRINTS_TYPE.ISprintReposiotry)
		private _sprintRepository: ISprintReposiotry,
		@inject(USER_TYPES.IUserRepository)
		private _userRepository: IUserRepository,
	) { }

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

		const sprints = await this._sprintRepository.findByProject(proejctId, companyId);
		const activeSprint = sprints.find((s) => s.status === "ACTIVE");

		let detailedMembers: any[] = [];
		if (project.members && project.members.length > 0) {
			
			try {
				
				const memberPromises = project.members.map(memberId => this._userRepository.findById(memberId));
				const members = await Promise.all(memberPromises);
				detailedMembers = members.filter(m => m !== null).map(m => ({
					id: m!.id!,
					name: m!.name,
					email: m!.email,
					role: m!.role
				}));
			} catch (error) {
				console.error("Error fetching project members", error);
			}
		}

		return {
			id: project.id!,
			name: project.name,
			description: project.description,
			status: project.status,
			startDate: project.startDate,
			endDate: project.endDate,
			gitRepoUrl: project.gitRepoUrl,
			members: detailedMembers,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt!,
			activeSprintId: activeSprint ? activeSprint.id : undefined,
		};
	}
}
