export interface IGetDetailPageUseCase{
    execute(companyId: string):Promise<any>
}