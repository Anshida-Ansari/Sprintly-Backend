export const STANDUP = {
	SUBMIT_STANDUP: "/:projectId/:sprintId/standups",
	SUBMIT_PROJECT_STANDUP: "/project/:projectId/standups",
	ADD_STANDUP: "/:projectId/:sprintId/standups/:standupId/comments",
	ADD_PROJECT_STANDUP: "/project/:projectId/standups/:standupId/comments",
	LIST_STANDUP: "/:projectId/:sprintId/standups",
	LIST_PROJECT_STANDUP: "/project/:projectId/standups",
	TODAY_STANDUP: "/:projectId/:sprintId/standups/today",
	TODAY_PROJECT_STANDUP: "/project/:projectId/standups/today",
};
