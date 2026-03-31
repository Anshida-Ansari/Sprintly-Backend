export class AddCommentDTO {
	userId: string;
	userName: string;
	userStoryId: string;
	message: string;

	constructor(data: { userId: string; userName: string; userStoryId: string; message: string }) {
		if (!data.userId) {
			throw new Error("UserId is required");
		}

		if (!data.userStoryId) {
			throw new Error("TaskId is required");
		}

		if (!data.message || !data.message.trim()) {
			throw new Error("Comment message cannot be empty");
		}

		this.userId = data.userId;
		this.userName = data.userName || "";
		this.userStoryId = data.userStoryId;
		this.message = data.message.trim();
	}
}