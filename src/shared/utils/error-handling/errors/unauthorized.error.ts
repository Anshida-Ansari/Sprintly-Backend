import { ClientErrorStatus } from "@domain/enum/status-codes/client.error.status.enum";
import { BaseError } from "../base.error";

export class Unauthorized extends BaseError {
	constructor(description = "Unauthorized") {
		super(
			"UnauthorizedError",
			ClientErrorStatus.UNAUTHORIZED,
			true,
			description,
		);
	}
}
