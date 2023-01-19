import {BaseError} from "./base.error";
export class EmptyIdOrPasswordError extends BaseError {
    statusCode = 401
    constructor(message: string) {
        super(message);
    }
}
