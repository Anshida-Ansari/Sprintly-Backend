import { ServerErrorStatus } from "../../../../domain/enum/status-codes/sever.error.status.enum";
import { BaseError } from "../base.error";

export class InternalServerError extends BaseError {
	constructor(description = "Internal Server error") {
		super(
			"InternalServerError",
			ServerErrorStatus.INTERNAL_SERVER_ERROR,
			false,
			description,
		);
	}
}
