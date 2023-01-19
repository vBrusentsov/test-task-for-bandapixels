import {BaseError} from "./base.error";
export class UnprocessableEntityError extends BaseError {
    statusCode = 422
    constructor(message: string) {
        super(message);
    }
}