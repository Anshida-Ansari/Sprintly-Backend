import type { CreateProjectDTO } from "@application/dtos/projects/create.project.dto";
import type { ICreateNotificationUseCase } from "@application/usecases/notification/interface/create.notification.interface";
import type { CreateProjectResponse } from "@application/usecases/projects/implementation/res/create.project.response";
import type { ICreateProjectUseCase } from "@application/usecases/projects/interface/create.project.interface";
import { ProjectEntity } from "@domain/entities/project.entities";
import { NotificationType } from "@domain/enum/notification/notification.types";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import { ProjectStatus } from "@domain/enum/project/project.status";
import type { IGitHubRepositoryService } from "@domain/interface/github.repository.interface";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import { GITHUB_TYPE } from "@infrastructure/di/types/github/github.types";
import { NOTIFICATION_TYPE } from "@infrastructure/di/types/notification/notification";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import { EncryptionUtil } from "@shared/utils/encryption/encryption.util";
import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { ForbiddenError } from "@shared/utils/error-handling/errors/forbidden.error";
import { NotFoundError } from "@shared/utils/error-handling/errors/not.found.error";
import { inject, injectable } from "inversify";

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepsitory: IProjectReposiotory,
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(GITHUB_TYPE.IGitHubRepositoryService)
		private _githubRepoService: IGitHubRepositoryService,
		@inject(NOTIFICATION_TYPE.ICreateNotificationUseCase)
		private _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(
		dto: CreateProjectDTO,
		adminId: string,
		companyId: string,
	): Promise<CreateProjectResponse> {
		const exisitingProjeect = await this._projectRepsitory.findOne({
			name: dto.name,
			companyId,
		});

		if (exisitingProjeect) {
			throw new ConflictError(ProjectErrorMessage.PROJECT_ALREADY_EXIST);
		}

		// ── Subscription Limit Check ──────────────────────────────────────
		const company = await this._companyRepository.findById(companyId);

		if (!company) {
			throw new NotFoundError("Company not found");
		}

		if (company.projectLimit !== -1) {
			const projectCount = await this._projectRepsitory.count({ companyId });
			if (projectCount >= company.projectLimit) {
				throw new ForbiddenError(ProjectErrorMessage.PROJECT_LIMIT_REACHED);
			}
		}
		// ─────────────────────────────────────────────────────────────────

		const startDate = new Date(dto.startDate);
		const endDate = new Date(dto.endDate);

		let gitRepoUrl = dto.gitRepoUrl;

		if (company?.githubAccessToken && !dto.gitRepoUrl) {
			try {
				const encryptionKey = process.env.ENCRYPTION_KEY;
				if (!encryptionKey) {
					console.error("ENCRYPTION_KEY not configured");
				} else {
					const decryptedToken = EncryptionUtil.decrypt(
						company.githubAccessToken,
						encryptionKey,
					);

					const githubRepo = await this._githubRepoService.createRepository(
						decryptedToken,
						dto.name,
						dto.description,
						true,
						company.githubOrganization,
					);

					gitRepoUrl = githubRepo.htmlUrl;
				}
			} catch (error: unknown) {
				console.error("Failed to create GitHub repository:", error);
			}
		}

		const Project = ProjectEntity.create({
			name: dto.name,
			description: dto.description,
			startDate,
			endDate,
			createdBy: adminId,
			companyId,
			status: ProjectStatus.ACTIVE,
			gitRepoUrl: gitRepoUrl,
			leadId: dto.leadId,
			members: [],
		});

		const savedProject = await this._projectRepsitory.create(Project);

		if (!savedProject.id) {
			throw new Error("Project ID is missing after save");
		}

		// Trigger Notification for the Lead
		if (savedProject.leadId) {
			await this._createNotificationUseCase.execute(
				savedProject.leadId,
				NotificationType.PROJECT_ASSIGNED,
				`You have been assigned as the lead for project: ${savedProject.name}`,
				savedProject.id,
				"PROJECT",
			);
		}

		return {
			id: savedProject.id,
			name: savedProject.name,
			description: savedProject.description,
			startDate: savedProject.startDate,
			endDate: savedProject.endDate,
			gitRepoUrl: savedProject.gitRepoUrl,
		};
	}
}
