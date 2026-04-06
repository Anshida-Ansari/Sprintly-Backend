import type { StandupEntity } from "@domain/entities/standup.entity";
import type { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { inject, injectable } from "inversify";
import type { IListStandupsUseCase } from "../interface/list.standup.interface";

@injectable()
export class ListStandupsUseCase implements IListStandupsUseCase {
	constructor(
		@inject(STANDUP_TYPES.IStandupRepository)
		private _standupRepository: IStandupRepository,
	) {}

	async execute(
		projectId?: string,
		sprintId?: string,
		date?: string,
	): Promise<StandupEntity[]> {
		if (sprintId) {
			return await this._standupRepository.findBySprintAndDate(sprintId, date);
		}
		if (projectId) {
			return await this._standupRepository.findByProjectAndDate(
				projectId,
				date,
			);
		}
		return [];
	}
}
