import {NextFunction, Request, Response} from "express";
import {BaseError} from "../errors";

export const errorHandling = (err: BaseError, req: Request, res: Response, next: NextFunction) => {
    console.log();
    res.status(err.statusCode).json({
        msg: err.message,
        success: false,
    });
};