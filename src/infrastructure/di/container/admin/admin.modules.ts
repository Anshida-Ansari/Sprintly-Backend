import { ContainerModule } from "inversify";
import { InviteMemberUseCase } from "src/application/usecases/admin/implementation/invite.member.usecase";
import { ADMIN_TYPES } from "../../types/admin/admin.types";
import { AdminController } from "src/presentation/http/controllers/admin.controller";
import { AuthGurd } from "src/presentation/express/middleware/auth.gurd";
import { VerifyInvitationUseCase } from "src/application/usecases/admin/implementation/verify.member.usecase";
import { ListUserUseCase } from "src/application/usecases/admin/implementation/list.members.usecase";
import { IListMembersUseCase } from "src/application/usecases/admin/interface/list.members.interface";
import { IVerifyInvitationUseCase } from "src/application/usecases/admin/interface/verify.member.interface";
import { IInviteMemberUseCase } from "src/application/usecases/admin/interface/invite.member.interface";

export const InviteModule = new ContainerModule(({bind})=>{
    bind<IInviteMemberUseCase>(ADMIN_TYPES.IInviteMemberUseCase).to(InviteMemberUseCase)
    bind<AdminController>(ADMIN_TYPES.AdminController).to(AdminController)
    bind<AuthGurd>(ADMIN_TYPES.AuthGurd).to(AuthGurd)
    bind<IVerifyInvitationUseCase>(ADMIN_TYPES.IVerifyInvitationUseCase).to(VerifyInvitationUseCase)
    bind<IListMembersUseCase>(ADMIN_TYPES.IListMembersUseCase ).to(ListUserUseCase)
}) 

