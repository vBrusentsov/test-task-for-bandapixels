import jwt from "jsonwebtoken";
import {config} from "../config";

export function generateAccessToken(id: string) {
    const payload = {
        id
    }
    return jwt.sign(payload, config.secretAccessToken, {expiresIn: '10m'});
}
export function generateRefreshToken(id: string) {
    const payload = {
        id
    }
    return jwt.sign(payload, config.secretRefreshToken, {expiresIn: '1d'});
}

export function validateRefreshToken(token: string) {
       try {
           return jwt.verify(token, config.secretRefreshToken);
       } catch (e) {
           return null
       }
}
