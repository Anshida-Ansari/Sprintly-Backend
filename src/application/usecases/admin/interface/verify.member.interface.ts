export interface IVerifyInvitationUseCase{
    execute(token: string):Promise<{

        name: string,
        email: string,
        companyId: string

    }>
}