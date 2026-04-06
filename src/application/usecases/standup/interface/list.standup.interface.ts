import type { StandupEntity } from "@domain/entities/standup.entity";

export interface IListStandupsUseCase {
	execute(
		projectId?: string,
		sprintId?: string,
		date?: string,
	): Promise<StandupEntity[]>;
}
