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

app.use(
	cors({
		origin: env.FRONTENT_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

import { BASE_API } from "@shared/constants/base/base.routes.constants";

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

export default app;
