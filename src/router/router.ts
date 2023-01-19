import express from "express";
import {ApiController} from "../controllers/api.controller";
import authMiddleware from '../middelwares/auth.middleware';
import userMiddleware from '../middelwares/user.middleware';
export function getRouter(apiController: ApiController) {
    const router =  express.Router();

    router.post('/signup', authMiddleware, apiController.signup.bind(apiController));
    router.post('/signin', authMiddleware, apiController.signin.bind(apiController));
    router.get('/info', userMiddleware, apiController.getInfo.bind(apiController));
    router.get('/latency', userMiddleware, apiController.latency.bind(apiController));
    router.get('/logout', userMiddleware, apiController.logout.bind(apiController));


    return router
}
