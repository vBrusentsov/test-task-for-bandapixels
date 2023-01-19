import {Connection} from "mysql2/promise";
import {DatabaseService} from "./database.service";
import {User} from "../interfaces";
import {generateAccessToken, generateRefreshToken, validateRefreshToken} from "./token.service";
import {JwtPayload} from "jsonwebtoken";
import {UnauthorizedError, IsNoFoundUserError, IncorrectPasswordError} from "../errors";


export class ApiService {
    connection: Connection

    constructor(databaseService: DatabaseService) {
        this.connection = databaseService.connection;
    }

    async registration(user: User) {

        const [queryToDb]: any = await this.connection.query("SELECT * FROM `users` WHERE `id` = ?", [user.id])

        if (user.id.toString().includes('@')) {
            user.id_types = 'email';
        } else {
            user.id_types = 'phone';
        }
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);
        if (queryToDb.length === 0) {
            await this.connection.query("INSERT INTO `users` (`id`, `password`, `id_type`, `token`) VALUES (?, ?, ?, ?)",
                [user.id, user.password, user.id_types, newRefreshToken]);
            return {newAccessToken, newRefreshToken}

        } else {
            throw new UnauthorizedError('This user already exists');
        }
    }
    async login(user: User) {
        const [queryToDb]: any = await this.connection.query("SELECT * FROM `users` WHERE `id` = ?", [user.id]);
        if (queryToDb.length === 0) {
            throw new IsNoFoundUserError(`No user found with this id`);
        }
        if (user.password !== queryToDb[0].password) {
            throw new IncorrectPasswordError(`No correct password`);
        }
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);
        await this.connection.query("UPDATE `users` SET `token` = ? WHERE `id` = ?", [newRefreshToken, user.id]);
        return {newAccessToken, newRefreshToken}
    }



    async getInfo(accessToken: string | undefined, refreshToken: string) {
            const verifyRefreshToken = validateRefreshToken(refreshToken);

            if (verifyRefreshToken === null) {
                throw new UnauthorizedError('Unauthorized')
            }
            const { id } = verifyRefreshToken as JwtPayload
            const newAccessToken = generateAccessToken( id );
            const newRefreshToken = generateRefreshToken( id );
            const [queryToDb]: any = await this.connection.query("SELECT * FROM `users` WHERE `id` = ?", [id]);
            const userId = queryToDb[0].id;
            const typeUserId = queryToDb[0].id_type;
            await this.connection.query("UPDATE `users` SET `token` = ? WHERE `id` = ?", [newRefreshToken, id]);
            return {newAccessToken, newRefreshToken, userId, typeUserId}

    }

    async latency(accessToken: string | undefined, refreshToken: string) {

        const verifyRefreshToken = validateRefreshToken(refreshToken);
        if (verifyRefreshToken === null) {
            throw new UnauthorizedError('Unauthorized')
        }
        const {id} = verifyRefreshToken as JwtPayload
        const newAccessToken = generateAccessToken(id);
        const newRefreshToken = generateRefreshToken(id);
        await this.connection.query("UPDATE `users` SET `token` = ? WHERE `id` = ?", [newRefreshToken, id]);
        return {newAccessToken, newRefreshToken};
    }

    async logout(query: Object, refreshToken: string) {
        const verifyRefreshToken = validateRefreshToken(refreshToken);
        if (verifyRefreshToken === null) {
            throw new UnauthorizedError('Unauthorized')
        }
        const {id} = verifyRefreshToken as JwtPayload
        console.log(id);
        if (query === 'false') {
            await this.connection.query("UPDATE `users` SET `token` = ? WHERE `id` = ?", ['', id]);
            return 'Successful logout with parameter false'
        }
        await this.connection.query("UPDATE `users` SET `token` = '' ");
        return 'Successful logout with parameter true'
    }
}
