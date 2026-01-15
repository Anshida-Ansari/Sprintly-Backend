export interface ICompleteSprintUseCase {
    execute(sprintId: string, companyId: string): Promise<void>;
}