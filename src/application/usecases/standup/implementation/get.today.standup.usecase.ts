import type { StandupEntity } from "@domain/entities/standup.entity";
import type { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { inject, injectable } from "inversify";
import type { IGetTodayStandupUseCase } from "../interface/get.today.standup.interface";

@injectable()
export class GetTodayStandupUseCase implements IGetTodayStandupUseCase {
	constructor(
		@inject(STANDUP_TYPES.IStandupRepository)
		private _standupRepository: IStandupRepository,
	) {}

	async execute(
		userId: string,
		projectId: string,
	): Promise<StandupEntity | null> {
		const todayStr = new Date().toISOString().split("T")[0];
		return await this._standupRepository.findUserStandupForDate(
			userId,
			projectId,
			todayStr,
		);
	}
}
