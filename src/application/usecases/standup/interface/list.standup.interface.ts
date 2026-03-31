import type { StandupEntity } from "@domain/entities/standup.entity";

export interface IListStandupsUseCase {
	execute(sprintId: string, date?: Date): Promise<StandupEntity[]>;
}
