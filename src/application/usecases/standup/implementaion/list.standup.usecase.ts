import { inject, injectable } from "inversify";
import { STANDUP_TYPES } from "@infrastructure/di/types/standup/standup.types";
import { IStandupRepository } from "@infrastructure/db/repository/interface/standup.interface";
import { StandupEntity } from "@domain/entities/standup.entity";
import { IListStandupsUseCase } from "../interface/list.standup.interface";

@injectable()
export class ListStandupsUseCase implements IListStandupsUseCase {
    constructor(
        @inject(STANDUP_TYPES.IStandupRepository)
        private _standupRepository: IStandupRepository
    ) { }

    async execute(sprintId: string, date: Date): Promise<StandupEntity[]> {

        return await this._standupRepository.findBySprintAndDate(sprintId, date);
    }
}