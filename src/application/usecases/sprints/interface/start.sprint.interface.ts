export interface IStartInterface{
    execute(
        sprintId: string,
        projectId: string,
        companyId: string
    ): Promise<{
        message: string
    }>
}