import {BaseError} from "./base.error";
export class IncorrectPasswordError extends BaseError {
    statusCode = 400
    constructor(message: string) {
        super(message);
    }
}
