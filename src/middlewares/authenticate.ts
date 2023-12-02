import { Request, Response, NextFunction } from "express";
import { checkAuth } from "../services/authenticationToken";
import { SERVER_MESSAGES } from "../types/response";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenAuth = req.get("tokenAuth")

        if (!tokenAuth || !checkAuth(tokenAuth)) return res.status(401).json({ success: false, message: SERVER_MESSAGES.unautorized })

        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ success: false, message: SERVER_MESSAGES.unautorized })
    }
}

export default authenticate;