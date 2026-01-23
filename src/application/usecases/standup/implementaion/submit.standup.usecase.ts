import { inject, injectable } from "inversify";
import type { ISubmitStandupUseCase } from "../interface/submit.standup.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import type { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { SPRINTS_TYPE } from "@infrastructure/di/types/spirnts/sprints.types";
import type { ISprintReposiotry } from "@infrastructure/db/repository/interface/sprints.interface";
import type { SubmitStandupDTO } from "@application/dtos/standup/submit.standup.dto";
import { StandupEntity } from "@domain/entities/standup.entity";

@injectable()
export class SubmitStandupUseCase implements ISubmitStandupUseCase {
	constructor(
		@inject(STANDUP_TYPES.IStandupRepository)
		private _standupRepository: IStandupRepository,
		@inject(SPRINTS_TYPE.ISprintReposiotry)
		private _sprintRepository: ISprintReposiotry,
	) {}

	async execute(
		dto: SubmitStandupDTO,
		userId: string,
		sprintId: string,
		projectId: string,
		companyId: string,
	): Promise<void> {
		const sprint = await this._sprintRepository.findById(sprintId);

		if (!sprint || sprint.status !== "ACTIVE") {
			throw new Error("Standups can only be submitted for active sprints.");
		}

		const existingStandup =
			await this._standupRepository.findUserStandupForDate(
				userId,
				sprintId,
				new Date(),
			);

		if (existingStandup) {
			existingStandup.update({
				yesterday: dto.yesterday,
				today: dto.today,
				blockers: dto.blockers,
			});
			await this._standupRepository.update(
				existingStandup.id!,
				existingStandup,
			);
		} else {
			const newStandup = StandupEntity.create({
				userId,
				projectId,
				sprintId,
				companyId,
				yesterday: dto.yesterday,
				today: dto.today,
				blockers: dto.blockers,
			});
			await this._standupRepository.create(newStandup);
		}
	}
}
