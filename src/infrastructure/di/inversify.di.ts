import { Container } from "inversify";
import { InviteModule } from "./container/admin/admin.modules";
import { AuthModule } from "./container/auth/auth.modules";
import { CompanyModule } from "./container/company/company.modules";
import { GitHubModule } from "./container/github/github.modules";
import { MeetingModule } from "./container/meeting/meeting.modules";
import { ProjectModule } from "./container/project/project.modules";
import { SprintModule } from "./container/sprints/sprints.modules";
import { StandupModule } from "./container/standup/standup.modules";
import { SubtaskModule } from "./container/subtask/subtask.modules";
import { SuperAdminModule } from "./container/superadmin/superadmin.modules";
import { UserModule } from "./container/user/user.modules";
import { UserStoryModule } from "./container/userstory/userstory.modules";
import { UserProfileModule } from "./container/userprofile/user.profile.modules";

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
	SubtaskModule,
	StandupModule,
	MeetingModule,
	GitHubModule,
	UserProfileModule

);

export { container };
