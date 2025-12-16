import { ListUserUseCase } from "src/application/usecases/admin/implementation/list.members.usecase";
import { VerifyInvitationUseCase } from "src/application/usecases/admin/implementation/verify.member.usecase";

export const ADMIN_TYPES = {
    AdminController : Symbol.for('AdminController'),
    InviteMemberUseCase : Symbol.for('InviteMemberUseCase'),
    AuthGurd: Symbol.for('AuthGurd'),
    VerifyInvitationUseCase: Symbol.for('VerifyInvitationUseCase'),
    ListUserUseCase:Symbol.for('ListUserUseCase')
}