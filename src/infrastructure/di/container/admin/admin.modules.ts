import { ContainerModule } from "inversify";
import { InviteMemberUseCase } from "src/application/usecases/admin/implementation/invite.member.usecase";
import { ADMIN_TYPES } from "../../types/admin/admin.types";
import { AdminController } from "src/presentation/http/controllers/admin.controller";
import { AuthGurd } from "src/shared/middleware/auth.gurd";

export const InviteModule = new ContainerModule(({bind})=>{
    bind<InviteMemberUseCase>(ADMIN_TYPES.InviteMemberUseCase).to(InviteMemberUseCase)
    bind<AdminController>(ADMIN_TYPES.AdminController).to(AdminController)
    bind<AuthGurd>(ADMIN_TYPES.AuthGurd).to(AuthGurd)
}) 