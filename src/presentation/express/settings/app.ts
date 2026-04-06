import express from "express";

const app = express();

import cookieParser from "cookie-parser";
import cors from "cors";
import env from "../../../infrastructure/providers/env/env.validation";
import { adminRouter } from "../router/admin/admin.router";
import { authRouter } from "../router/auth/auth.router";
import githubRouter from "../router/github/github.router";
import meetingRouter from "../router/meeting/meeting.router";
import { projectRouter } from "../router/projects/project.router";
import { sprintRouter } from "../router/sprints/sprints.router";
import { standupRouter } from "../router/standup/standup.router";
import { subTaskRouter } from "../router/subtask/subtask.router";
import { superadminRouter } from "../router/superadmin/superadmin.router";
import { userstoryRouter } from "../router/userstory/userstory.router";
import { notificationRouter } from "../router/notification/notification.router";
import { aiRouter } from "../router/ai/ai.router";
import { workLogRouter } from "../router/worklog/worklog.router.js";
import { analyticsRouter } from "../router/analytics/analytics.router";

app.use(
	cors({
		origin: env.FRONTENT_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
  });

  next();
});

import { BASE_API } from "@shared/constants/base/base.routes.constants";
import { userprofileRotuer } from "../router/userprofile/user.profile.router";
import { logger } from "@infrastructure/providers/logger/pino.logger";

app.use(BASE_API.AUTH, authRouter);
app.use(BASE_API.ADMIN, adminRouter);
app.use(BASE_API.SUPERADMIN, superadminRouter);
app.use(BASE_API.PROJECT, projectRouter);
app.use(BASE_API.USER_STORY, userstoryRouter);
app.use(BASE_API.SPRINT, sprintRouter);
app.use(BASE_API.SUBTASK, subTaskRouter);
app.use(BASE_API.STANDUP, standupRouter);
app.use(BASE_API.MEETING, meetingRouter);
app.use(BASE_API.GITHUB, githubRouter);
app.use(BASE_API.USER_PROFILE, userprofileRotuer)
app.use(BASE_API.NOTIFICATION, notificationRouter);
app.use(BASE_API.AI, aiRouter);
app.use(BASE_API.WORKLOG, workLogRouter);
app.use(BASE_API.ANALYTICS, analyticsRouter);

export default app;
