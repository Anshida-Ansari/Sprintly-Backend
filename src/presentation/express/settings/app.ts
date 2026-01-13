import express from "express";

const app = express();

import cookieParser from "cookie-parser";
import cors from "cors";
import env from "../../../infrastructure/providers/env/env.validation";
import { adminRouter } from "../router/admin/admin.router";
import { authRouter } from "../router/auth/auth.router";
import { projectRouter } from "../router/projects/project.router";
import { superadminRouter } from "../router/superadmin/superadmin.router";
import { userstoryRouter } from "../router/userstory/userstory.router";
import { sprintRouter } from "../router/sprints/sprints.router";
import { subTaskRouter } from "../router/subtask/subtask.router";

app.use(
	cors({
		origin: env.FRONTENT_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/superadmin", superadminRouter);
app.use("/api/project", projectRouter);
app.use("/api/projects", userstoryRouter);
app.use("/api/project",sprintRouter);
app.use("/api/userstory",subTaskRouter)


export default app;
