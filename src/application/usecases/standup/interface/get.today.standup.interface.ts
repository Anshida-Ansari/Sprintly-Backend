import type { StandupEntity } from "@domain/entities/standup.entity";

export interface IGetTodayStandupUseCase {
	execute(userId: string, projectId: string): Promise<StandupEntity | null>;
}
