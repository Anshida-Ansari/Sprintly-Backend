import { inject, injectable } from "inversify";

import type { CreateProjectDTO } from "@application/dtos/projects/create.project.dto";

import { ProjectEntity } from "@domain/entities/project.entities";
import { ProjectErrorMessage } from "@domain/enum/project/project.error.message";
import { ProjectStatus } from "@domain/enum/project/project.status";

import type { IProjectReposiotory } from "@infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPE } from "@infrastructure/di/types/Project/project.types";
import type { ICompanyRepository } from "@infrastructure/db/repository/interface/company.interface";
import { COMPANY_TYPES } from "@infrastructure/di/types/company/company.types";
import type { IGitHubRepositoryService } from "@domain/interface/github.repository.interface";
import { GITHUB_TYPE } from "@infrastructure/di/types/github/github.types";

import { ConflictError } from "@shared/utils/error-handling/errors/conflict.error";
import { EncryptionUtil } from "@shared/utils/encryption/encryption.util";

import type { ICreateProjectUseCase } from "@application/usecases/projects/interface/create.project.interface";
import type { CreateProjectResponse } from "@application/usecases/projects/implementation/res/create.project.response";

@injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
	constructor(
		@inject(PROJECT_TYPE.IProjectRepository)
		private _projectRepsitory: IProjectReposiotory,
		@inject(COMPANY_TYPES.ICompanyRepository)
		private _companyRepository: ICompanyRepository,
		@inject(GITHUB_TYPE.IGitHubRepositoryService)
		private _githubRepoService: IGitHubRepositoryService,
	) { }

	async execute(dto: CreateProjectDTO,adminId: string,companyId: string): Promise<CreateProjectResponse> {
		
		const exisitingProjeect = await this._projectRepsitory.findOne({
			name: dto.name,
			companyId,
		});

		if (exisitingProjeect) {
			throw new ConflictError(ProjectErrorMessage.PROJECT_ALREADY_EXIST);
		}

		const startDate = new Date(dto.startDate);
		const endDate = new Date(dto.endDate);

		let gitRepoUrl = dto.gitRepoUrl;

		const company = await this._companyRepository.findById(companyId);

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

		return {
			id: savedProject.id!,
			name: savedProject.name,
			description: savedProject.description,
			startDate: savedProject.startDate,
			endDate: savedProject.endDate,
			gitRepoUrl: savedProject.gitRepoUrl,
		};
	}
}
