export interface IUpdateStatusInterface{
    execute(companyId: string, status: string):Promise<{
        message: string
    }>
}