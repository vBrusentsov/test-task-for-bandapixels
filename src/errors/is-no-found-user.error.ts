import {BaseError} from "./base.error";
export class IsNoFoundUserError extends BaseError {
    statusCode = 404
    constructor(message: string) {
        super(message);
    }
}
