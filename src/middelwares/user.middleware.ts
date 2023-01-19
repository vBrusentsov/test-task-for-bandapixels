import {NextFunction, Request, Response} from "express";
import {UnauthorizedError} from "../errors";

export = function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        throw new UnauthorizedError('User is not authorized');
    }
    return next()
}