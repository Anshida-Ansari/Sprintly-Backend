import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";
import { BaseError } from "../base.error";

export class ForbiddenError extends BaseError{
    constructor(description = "Forbidden"){
        super("ForbidenError",ClientErrorStatus.FORBIDDEN,true,description)
    }
}