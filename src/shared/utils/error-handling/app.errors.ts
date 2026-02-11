import { ServerErrorStatus } from "@domain/enum/status-codes/sever.error.status.enum";
import { BaseError } from "./base.error";

export default class AppError extends BaseError {
	public readonly data?: unknown;

	constructor(
		message: string,
		statusCode: number = ServerErrorStatus.INTERNAL_SERVER_ERROR,
		data?: unknown,
	) {
		super("AppError", statusCode, true, message);
		this.data = data;
	}
}
