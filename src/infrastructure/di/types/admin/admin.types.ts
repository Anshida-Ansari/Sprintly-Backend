import { ListUserUseCase } from "src/application/usecases/admin/implementation/list.members.usecase";
import { VerifyInvitationUseCase } from "src/application/usecases/admin/implementation/verify.member.usecase";

export const ADMIN_TYPES = {
	AdminController: Symbol.for("AdminController"),
	IInviteMemberUseCase: Symbol.for("IInviteMemberUseCase"),
	AuthGurd: Symbol.for("AuthGurd"),
	IVerifyInvitationUseCase: Symbol.for("IVerifyInvitationUseCase"),
	IListMembersUseCase: Symbol.for("IListMembersUseCase"),
};
