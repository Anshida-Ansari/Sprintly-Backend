import type { InviteMemberDTO } from "../../../../application/dtos/admin/invite.member.dto";

export interface IInviteMemberUseCase {
	execute(
		dto: InviteMemberDTO,
		companyId: string,
		adminId: string,
	): Promise<{
		message: string;
		inviteLink: string;
	}>;
}
