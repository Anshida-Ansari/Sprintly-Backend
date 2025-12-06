import { InviteMemberDTO } from "src/application/dtos/admin/invite.member.dto";

export interface IInviteMemberUseCase{
    execute(dto:InviteMemberDTO,companyId: string,adminId: string):Promise<{

        message: string,
        inviteLink: string
        
    }>
} 