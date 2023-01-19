import * as EmailValidator from "email-validator";
import {NextFunction, Request, Response} from "express";
import {IdIsNotCorrect, EmptyIdOrPasswordError} from "../errors";

export = function (req: Request, res: Response, next: NextFunction) {
    if (req.body.id.length === 0 || req.body.password.length === 0) {
        throw new EmptyIdOrPasswordError("id or password not be empty");

    }
    if (!EmailValidator.validate(req.body.id) && isNaN(+req.body.id)) {
        throw new IdIsNotCorrect("Id is not correct");
    }
    return next()
}
