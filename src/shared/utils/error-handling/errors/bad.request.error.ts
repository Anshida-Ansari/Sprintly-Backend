import { BaseError } from "../base.error";

export class BadRequestError extends BaseError {
    constructor(description: string) {
        super("BadRequestError", 400 , true, description);
    }
}
