import { StandupEntity } from "@domain/entities/standup.entity";
import { IBaseRepository } from "./base.repository";

export interface IStandupRepository  extends IBaseRepository<StandupEntity>{
    findById(id: string): Promise<StandupEntity | null>;
    findUserStandupForDate(userId: string, sprintId: string, date: Date): Promise<StandupEntity | null>;
    findBySprintAndDate(sprintId: string, date: Date): Promise<StandupEntity[]>;
}