export const SUBTASK = {
	CREATE_SUBTASK: "/:userStoryId/subtask",
	UPDATE_STATUS: "/:subtaskId/status",
	LIST_SUBTASK: "/subtask/:userStoryId",
	ASSIGN_MEMBER: "/:subtaskId/assign-members",
	DELETE_SUBTASK: "/:subtaskId",
	ADD_COMMENT_SUBTASK: "/:subtaskId/comments",
	UPDATE_TIME: "/:subtaskId/time",
	UPLOAD_URL: "/upload-url",
	ADD_ATTACHMENT: "/:subtaskId/attachments",
	DOWNLOAD_URL: "/download-url",
};
