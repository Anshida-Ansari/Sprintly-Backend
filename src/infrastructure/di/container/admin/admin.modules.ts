import { ContainerModule } from "inversify";
import { InviteMemberUseCase } from "../../../../application/usecases/admin/implementation/invite.member.usecase";
import { ListUserUseCase } from "../../../../application/usecases/admin/implementation/list.members.usecase";
import { VerifyInvitationUseCase } from "../../../../application/usecases/admin/implementation/verify.member.usecase";
import type { IInviteMemberUseCase } from "../../../../application/usecases/admin/interface/invite.member.interface";
import type { IListMembersUseCase } from "../../../../application/usecases/admin/interface/list.members.interface";
import type { IVerifyInvitationUseCase } from "../../../../application/usecases/admin/interface/verify.member.interface";
import type { IBlockUserUseCase } from "../../../../application/usecases/admin/interface/block.user.interface";
import { BlockUserUseCase } from "../../../../application/usecases/admin/implementation/block.user.usecase";
import { AuthGurd } from "../../../../presentation/express/middleware/auth.gurd";
import { AdminController } from "../../../../presentation/http/controllers/admin.controller";
import { ADMIN_TYPES } from "../../types/admin/admin.types";

export const InviteModule = new ContainerModule(({ bind }) => {
	bind<IInviteMemberUseCase>(ADMIN_TYPES.IInviteMemberUseCase).to(
		InviteMemberUseCase,
	);
	bind<AdminController>(ADMIN_TYPES.AdminController).to(AdminController);
	bind<AuthGurd>(ADMIN_TYPES.AuthGurd).to(AuthGurd);
	bind<IVerifyInvitationUseCase>(ADMIN_TYPES.IVerifyInvitationUseCase).to(
		VerifyInvitationUseCase,
	);
	bind<IListMembersUseCase>(ADMIN_TYPES.IListMembersUseCase).to(
		ListUserUseCase,
	);
	bind<IBlockUserUseCase>(ADMIN_TYPES.IBlockUserUseCase).to(
		BlockUserUseCase,
	);
});
