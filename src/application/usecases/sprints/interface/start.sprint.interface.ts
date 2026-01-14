export interface IStartSprintUseCase{
    execute(companyId: string, sprintId: string):Promise<void>
}