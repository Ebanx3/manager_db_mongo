import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";
import { ServerResponse, SERVER_MESSAGES } from "../types/response";

export const validateUserData = async (req: Request, res: Response<ServerResponse>, next: NextFunction) => {
    const { password, email }: { email: string, password: string } = req.body;

    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(401).json({
        success: false,
        message: SERVER_MESSAGES.invalidEmail
    })

    if (!password || password.length < 8) return res.status(401).json({
        success: false,
        message: SERVER_MESSAGES.invalidPassword
    })

    if (req.route.path === "/signup") {
        try {
            const userdata = await UserModel.getByEmail({ email })
            if (userdata) {
                return res.status(401).json({
                    success: false,
                    message: SERVER_MESSAGES.emailAlreadyUser
                })
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: "Server error" })
        }
    }

    next();
}