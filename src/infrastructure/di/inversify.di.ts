import { Container } from "inversify";
import { InviteModule } from "./container/admin/admin.modules";
import { AiModule } from "./container/ai/ai.modules";
import { AnalyticsModule } from "./container/analytics/analytics.modules";
import { AuthModule } from "./container/auth/auth.modules";
import { CompanyModule } from "./container/company/company.modules";
import { GitHubModule } from "./container/github/github.modules";
import { MeetingModule } from "./container/meeting/meeting.modules";
import { NotificationModule } from "./container/notification/notification.modules";
import { ProjectModule } from "./container/project/project.modules";
import { ReportsModule } from "./container/reports/reports.modules";
import { SprintModule } from "./container/sprints/sprints.modules";
import { StandupModule } from "./container/standup/standup.modules";
import { SubscriptionPlanModule } from "./container/subscription-plan/subscription.plan.modules";
import { SubtaskModule } from "./container/subtask/subtask.modules";
import { SuperAdminModule } from "./container/superadmin/superadmin.modules";
import { TransactionModule } from "./container/transaction/transaction.modules";
import { UserModule } from "./container/user/user.modules";
import { UserProfileModule } from "./container/userprofile/user.profile.modules";
import { UserStoryModule } from "./container/userstory/userstory.modules";
import { WorkLogModule } from "./container/worklog/worklog.modules.js";

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
	UserProfileModule,
	NotificationModule,
	AiModule,
	WorkLogModule,
	AnalyticsModule,
	TransactionModule,
	ReportsModule,
	SubscriptionPlanModule,
);

export { container };
