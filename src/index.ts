import express, {Request, Response} from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import { getRouter } from './router/router';
import { DatabaseService } from './service/database.service';
import { ApiService } from './service/api.service';
import { ApiController } from './controllers/api.controller';
import cookieParser from 'cookie-parser';
import {errorHandling} from './handlers/error.hendlers';
import authMiddleware from './middelwares/auth.middleware';
import userMiddleware from './middelwares/user.middleware';


dotenv.config();


const port = process.env.PORT

const start = async () => {
    try{
        const databaseService = new DatabaseService({
            host:process.env.HOST,
            user:process.env.USER,
            password:process.env.PASSWORD,
            database:process.env.DATABASE,
        })
        await databaseService.init();

        console.log('connected to mysql successful')

        const signupService =  new ApiService(databaseService);
        const signupControllers  =  new ApiController(signupService);
        const router = getRouter(signupControllers);

        const app = express();

        app.use(cors({
            origin: '*'
        }))
        app.use(express.json());
        app.use(cookieParser());
        app.use('/api', router);
        app.use(errorHandling);
        app.use(authMiddleware);
        app.use(userMiddleware);


        app.listen(port, () => {
            console.log(`Server working on port ${port}`);
        });



    } catch (error: unknown) {
        console.log(error)
    }
}

start()

