import { BaseError } from "../base.error";
import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";

export class ConflictError extends BaseError{
    constructor(descripption = "Resources conflict"){
        super("ConflictError",ClientErrorStatus.CONFLICT, true , descripption)
    }
}