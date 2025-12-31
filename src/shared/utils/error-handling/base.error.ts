import { ServerErrorStatus } from "src/domain/enum/status-codes/sever.error.status.enum";

export class BaseError extends Error {
	public readonly name: string;
	public readonly statusCode: number;
	public readonly isOperational: boolean;
	public readonly description: string;

	constructor(
		name: string,
		statusCode: number = ServerErrorStatus.INTERNAL_SERVER_ERROR,
		isOperational: boolean = true,
		description: string = "Unexpected Error Occurred",
	) {
		super(description);

		Object.setPrototypeOf(this, new.target.prototype);
		(this.name = name),
			(this.statusCode = statusCode),
			(this.isOperational = isOperational);
		this.description = description;

		Error.captureStackTrace(this);
	}
}
