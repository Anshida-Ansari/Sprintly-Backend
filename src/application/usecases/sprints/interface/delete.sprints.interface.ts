export interface IDeleteSprintUseCase{
    execute(sprintId: string, companyId: string):Promise<void>
}