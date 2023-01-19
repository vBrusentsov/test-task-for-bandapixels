export class BaseError extends Error {
    statusCode = 500
    constructor(message: string) {
        super(message);
    }

}