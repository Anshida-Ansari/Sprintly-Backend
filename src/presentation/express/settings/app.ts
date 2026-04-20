import express from "express";

const app = express();

import cookieParser from "cookie-parser";
import cors from "cors";
import env from "../../../infrastructure/providers/env/env.validation";
import { adminRouter } from "../router/admin/admin.router";
import { aiRouter } from "../router/ai/ai.router";
import { analyticsRouter } from "../router/analytics/analytics.router";
import { authRouter } from "../router/auth/auth.router";
import githubRouter from "../router/github/github.router";
import meetingRouter from "../router/meeting/meeting.router";
import { notificationRouter } from "../router/notification/notification.router";
import { projectRouter } from "../router/projects/project.router";
import { reportsRouter } from "../router/reports/reports.router";
import { sprintRouter } from "../router/sprints/sprints.router";
import { standupRouter } from "../router/standup/standup.router";
import { subTaskRouter } from "../router/subtask/subtask.router";
import { superadminRouter } from "../router/superadmin/superadmin.router";
import { userstoryRouter } from "../router/userstory/userstory.router";
import { workLogRouter } from "../router/worklog/worklog.router.js";

app.use(
	cors({
		origin: env.FRONTENT_URL,
		credentials: true,
	}),
);

// Apply JSON body parser to ALL routes EXCEPT the stripe webhook
// Stripe needs the raw Buffer body for signature verification
app.use((req, res, next) => {
	if (req.originalUrl.includes("/stripe-webhook")) {
		next(); // Skip JSON parsing — the router uses express.raw() for this route
	} else {
		express.json()(req, res, next);
	}
});
app.use(cookieParser());

app.use((req, _res, next) => {
	logger.info({
		method: req.method,
		url: req.originalUrl,
	});

	next();
});

import { logger } from "@infrastructure/providers/logger/pino.logger";
import { BASE_API } from "@shared/constants/base/base.routes.constants";
import { userprofileRotuer } from "../router/userprofile/user.profile.router";

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
app.use(BASE_API.USER_PROFILE, userprofileRotuer);
app.use(BASE_API.NOTIFICATION, notificationRouter);
app.use(BASE_API.AI, aiRouter);
app.use(BASE_API.WORKLOG, workLogRouter);
app.use(BASE_API.ANALYTICS, analyticsRouter);
app.use(BASE_API.REPORTS, reportsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});


export default app;
