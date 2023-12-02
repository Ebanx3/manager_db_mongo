import jwt from "jsonwebtoken";
import { User } from "../types/user";
import config from "../config";

export const generateAuthToken = (user: User) => {
    const data = {
        email: user.email,
        id: user._id,
    }

    const token = jwt.sign(data, config.TOKEN_SECRET_KEY || '', { expiresIn: '15 days' });

    return token;
}

export const setAuthTokenNull = () => {
    const token = jwt.sign({}, config.TOKEN_SECRET_KEY || '', { expiresIn: 0 });
    return token;
}

export const checkAuth = (token: string) => {
    try {
        const res = jwt.verify(token, config.TOKEN_SECRET_KEY || ' ');
        return res;
    }
    catch (error) {
        console.log(error);
        return null
    }

}