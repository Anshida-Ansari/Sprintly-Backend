import type { CreateSprintDTO } from "@application/dtos/sprints/create.sprints.dto";
import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import type { ICreateSprintUseCase } from "@application/usecases/sprints/interface/create.sprint.interface";
import { SprintEntity } from "@domain/entities/sprint.entity";
import { ErrorMessage } from "@domain/enum/messages/error.message.enum";
import { NotificationType } from "@domain/enum/notification/notification.types";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import { SprintErrorMessage } from "@domain/enum/sprints/sprints.error.message";
import { SprintStatus } from "@domain/enum/sprints/sprints.status";
import type { IProjectRepository } from "@infrastructure/db/repository/interface/project.interface";
import type { ISprintRepository } from "@infrastructure/db/repository/interface/sprints.interface";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { SPRINTS_TYPE } from "@infrastructure/di/types/sprints/sprints.types";
import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";

@injectable()
export class CreateSprintUseCase implements ICreateSprintUseCase {
	constructor(
		@inject(SPRINTS_TYPE.ISprintRepository)
		private _sprintRepository: ISprintRepository,
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepository: IProjectRepository,
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(
		dto: CreateSprintDTO,
		projectId: string,
		companyId: string,
	): Promise<{
		id: string;
		name: string;
		goal: string;
		status: SprintStatus;
		createdAt: Date;
	}> {
		const project = await this._projectRepository.findById(projectId);
		if (!project) {
			throw new NotFoundError(ProjectErrorMessage.PROJECT_NOT_FOUND);
		}

		if (project.companyId.toString() !== companyId.toString()) {
			throw new ForbiddenError(ErrorMessage.FORBIDDEN);
		}

		const sprintStart = new Date(dto.startDate);
		const sprintEnd = new Date(dto.endDate);
		const projectStart = new Date(project.startDate);
		const projectEnd = new Date(project.endDate);

		if (sprintStart < projectStart || sprintEnd > projectEnd) {
			throw new ConflictError(
				`Sprint dates must be within the project duration: ${projectStart.toDateString()} to ${projectEnd.toDateString()}`,
			);
		}

		const activeSprints =
			await this._sprintRepository.findActiveSprintByProject(projectId);

		if (activeSprints) {
			throw new ConflictError(SprintErrorMessage.ACTIVE_SPRINT);
		}

		const overlappingSprint = await this._sprintRepository.hasOverlappingSprint(
			projectId,
			dto.startDate,
			dto.endDate,
		);

		if (overlappingSprint) {
			throw new ConflictError(SprintErrorMessage.SPRINTS_OVERLAP);
		}

		const sprint = SprintEntity.create({
			projectId,
			companyId,
			name: dto.name,
			goal: dto.goal,
			startDate: dto.startDate,
			endDate: dto.endDate,
			status: SprintStatus.PLANNED,
		});

		const createdSprint = await this._sprintRepository.create(sprint);

		if (!createdSprint.id) {
			throw new Error("Sprint ID is missing after creation");
		}

		// Trigger Notifications for all project members
		for (const memberId of project.members) {
			this._createNotificationUseCase
				.execute(
					memberId,
					NotificationType.SPRINT_CREATED,
					`A new sprint "${createdSprint.name}" has been created in your project.`,
					createdSprint.id,
					"SPRINT",
				)
				.catch((err) => console.error("Failed to send notification:", err));
		}

		return {
			id: createdSprint.id,
			name: createdSprint.name,
			goal: createdSprint.goal ?? "",
			status: createdSprint.status,
			createdAt: createdSprint.createdAt,
		};
	}
}
