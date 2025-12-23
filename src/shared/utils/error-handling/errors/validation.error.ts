import { BaseError } from "../base.error";
import { ClientErrorStatus } from "src/domain/enum/status-codes/client.error.status.enum";

export class validationError extends BaseError{
    public readonly details?: Record<string, string>

    constructor(description = "Invalid input",details?:Record<string, string> ){
        super("validationError",ClientErrorStatus.BAD_REQUEST,true,description)
        this.details = details
    }
}