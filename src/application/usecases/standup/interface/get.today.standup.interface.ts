import type { StandupEntity } from "@domain/entities/standup.entity";

export interface IGetTodayStandupUseCase {
	execute(userId: string, sprintId: string): Promise<StandupEntity | null>;
}
