import { ServerErrorStatus } from "@domain/enum/status-codes/sever.error.status.enum";
import { BaseError } from "../base.error";

export class ServiceUnavailableError extends BaseError {
	constructor(description = "Service unavailable") {
		super(
			"ServiceUnavailable",
			ServerErrorStatus.SERVICE_UNAVAILABLE,
			false,
			description,
		);
	}
}
