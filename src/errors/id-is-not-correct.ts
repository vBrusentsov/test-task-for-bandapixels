import {BaseError} from "./base.error";
export class IdIsNotCorrect extends BaseError {
    statusCode = 401
    constructor(message: string) {
        super(message);
    }
}