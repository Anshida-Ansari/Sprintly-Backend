import { ClientErrorStatus } from "@domain/enum/status-codes/client.error.status.enum";
import { BaseError } from "../base.error";

export class ConflictError extends BaseError {
	constructor(descripption = "Resources conflict") {
		super("ConflictError", ClientErrorStatus.CONFLICT, true, descripption);
	}
}
