export class AddCommentSubTaskDTO {
	userId: string;
	userName: string;
	subtaskId: string;
	message: string;

	constructor(data: { userId: string; userName: string; subtaskId: string; message: string }) {
		if (!data.userId) {
			throw new Error("UserId is required");
		}

		if (!data.subtaskId) {
			throw new Error("TaskId is required");
		}

		if (!data.message || !data.message.trim()) {
			throw new Error("Comment message cannot be empty");
		}

		this.userId = data.userId;
		this.userName = data.userName || "";
		this.subtaskId = data.subtaskId;
		this.message = data.message.trim();
	}
}