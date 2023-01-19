import {ApiService} from "../service/api.service";
import {Request, Response} from "express";
import * as EmailValidator from 'email-validator';
import http from 'http';
import {UnprocessableEntityError} from "../errors";



export class ApiController {

    constructor(private apiService: ApiService) {
    }

    async signup(req: Request, res: Response) {
        const signupResponse = await this.apiService.registration(req.body);
        res.cookie('refreshToken', signupResponse.newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json(signupResponse);
    }

    async signin(req: Request, res: Response) {
        const signinResponse = await this.apiService.login(req.body);
        res.cookie('refreshToken', signinResponse.newRefreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.status(200).json(signinResponse);
    }


    async getInfo(req: Request, res: Response ) {

           const accessToken = req.headers.authorization;
           const {refreshToken} = req.cookies;
           const getInfo = await this.apiService.getInfo(accessToken, refreshToken);
           res.cookie('refreshToken', getInfo.newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
           res.status(200).json(getInfo);
    }

    async latency(req: Request, res: Response) {
        const accessToken = req.headers.authorization;
        const options = {
            host: 'www.google.com'
        };
        const start = Date.now();
        http.get(options, function (http_res) {
            let data = "";
            http_res.on("data", function (chunk) {
               return data += chunk;
            });
            http_res.on("end", function () {
                return(data);
            });
        });
        const end = Date.now();
        const result = end - start;
        const {refreshToken} = req.cookies;
        const tokenResponse = await this.apiService.latency(accessToken, refreshToken);
        res.cookie('refreshToken', tokenResponse.newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json( [tokenResponse ,`Service server latency for google.com is ${result} milliseconds`]);
    }

    async logout(req: Request, res: Response) {
        if (!req.query.all) {
            throw new UnprocessableEntityError('Invalid query parameter');
        }
        const {all} = req.query
        const {refreshToken} = req.cookies;
        const logoutResponse = await this.apiService.logout(all, refreshToken);
        res.status(200).json(logoutResponse);
    }
}
