export interface ISetPassWordUseCase{
    execute(token: string,password: string):Promise<{
        message: string,
    }>
}