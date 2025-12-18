import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";
import { BaseError } from "../base.error";

export class NotFoundError extends BaseError {
    constructor(description = "Resources not found") {
        super("NotFoundError", ClientErrorStatus.NOT_FOUND, true, description)
    }
}