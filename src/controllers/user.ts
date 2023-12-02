import { Request, Response } from "express";
import UserModel from "../models/user";
import { hash, compare } from "bcrypt";
import { Collection, User } from "../types/user";
import { formatUser } from "../utils";
import { SERVER_MESSAGES, ServerResponse } from "../types/response";
import { checkAuth, generateAuthToken } from "../services/authenticationToken";

export class UserController {

    static async login(req: Request, res: Response<ServerResponse>) {
        try {
            const { email, password } = req.body;

            const user: User = await UserModel.getByEmail({ email });

            if (!user) return res.status(401).json({
                success: false,
                message: SERVER_MESSAGES.incorrectDataLogin
            })

            const samePass = await compare(password, user.password)
            if (!samePass) return res.status(401).json({
                success: false,
                message: SERVER_MESSAGES.incorrectDataLogin
            })

            const formatedUser = formatUser(user);

            const token = generateAuthToken(user)

            res.status(200).setHeader("tokenAuth", token).json({
                success: true,
                message: SERVER_MESSAGES.correctLogin,
                data: formatedUser
            })

        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: SERVER_MESSAGES.serverError
            })
        }
    }

    static async signup(req: Request, res: Response<ServerResponse>) {
        try {
            const { email, password } = req.body;

            const hashedPassword = await hash(password, 10)

            const currentTimestamp = new Date();

            const user = {
                email,
                password: hashedPassword,
                createdAt: currentTimestamp.toDateString(),
                updatedAt: currentTimestamp.toDateString(),
                collections: []
            }

            const response = await UserModel.create({ element: user })

            res.status(201).json({
                success: true,
                message: SERVER_MESSAGES.correctSignup,
                data: response
            })
        }
        catch (err) {
            res.status(500).json(
                {
                    success: false,
                    message: SERVER_MESSAGES.serverError
                }
            )
        }
    }


    static async addCollection(req: Request, res: Response<ServerResponse>) {
        try {
            const tokenAuth = req.get("tokenAuth");
            const { id } = checkAuth(tokenAuth!) as { id: string, email: string };

            const { collection }: { collection: Collection } = req.body;
            if (!collection || !collection.name || !collection.fields) {
                return res.status(400).json({ success: false, message: SERVER_MESSAGES.bodyMustContainCollection })
            }

            const isArray = (obj: any): obj is Array<any> => {
                return Array.isArray(obj)
            }

            if (!isArray(collection.fields) || collection.fields.length === 0) {
                return res.status(400).json({ success: false, message: SERVER_MESSAGES.collectionWithFields });
            }

            const fieldFormatError = { error: false }
            collection.fields.forEach(field => {
                if (!field.name || !field.type) {
                    fieldFormatError.error = true;
                    return;
                }
            });

            if (fieldFormatError.error) {
                return res.status(400).json({ success: false, message: SERVER_MESSAGES.invalidFormatFields })
            }

            const user: User = await UserModel.getById({ id });

            const newCollections = [...user.collections, collection]

            const updatedUser = await UserModel.findByIdAndUpdate(id, { collections: newCollections })

            return res.status(200).json({ success: true, message: SERVER_MESSAGES.newCollectionAdded, data: updatedUser })

        }
        catch (err) {
            console.log(err)
            res.status(500).json(
                {
                    success: false,
                    message: "Server error"
                }
            )
        }
    }
}