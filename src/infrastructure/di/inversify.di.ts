import { Container } from "inversify";
import { InviteModule } from "./container/admin/admin.modules";
import { AuthModule } from "./container/auth/auth.modules";
import { CompanyModule } from "./container/company/company.modules";
import { ProjectModule } from "./container/project/project.modules";
import { SuperAdminModule } from "./container/superadmin/superadmin.modules";
import { UserModule } from "./container/user/user.modules";
import { UserStoryModule } from "./container/userstory/userstory.modules";
import { SprintModule } from "./container/sprints/sprints.modules";

const container = new Container({
	defaultScope: "Singleton",
	autobind: true,
});

container.load(
	AuthModule,
	UserModule,
	CompanyModule,
	InviteModule,
	SuperAdminModule,
	ProjectModule,
	UserStoryModule,
	SprintModule,
);

export { container };
