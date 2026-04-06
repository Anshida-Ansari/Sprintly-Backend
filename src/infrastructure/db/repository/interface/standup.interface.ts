import type { StandupEntity } from "@domain/entities/standup.entity";
import type { IBaseRepository } from "./base.repository";

export interface IStandupRepository extends IBaseRepository<StandupEntity> {
	findById(id: string): Promise<StandupEntity | null>;
	findUserStandupForDate(
		userId: string,
		projectId: string,
		date: string,
	): Promise<StandupEntity | null>;
	findBySprintAndDate(
		sprintId: string,
		date?: string,
	): Promise<StandupEntity[]>;
	findByProjectAndDate(
		projectId: string,
		date?: string,
	): Promise<StandupEntity[]>;
}
