import { ObjectId } from "mongodb";
import dbConnection from "../services/db";
// import { Model } from "../types/model";

const USERS_COLLECTION_NAME = "users";

export class UserModel {

    static async getAll() {

    }

    static async create({ element }: { element: object }) {
        const dbConn = new dbConnection({ collectionName: USERS_COLLECTION_NAME });
        return await dbConn.create({ element })
    }

    static async getByEmail({ email }: { email: string }) {
        const dbConn = new dbConnection({ collectionName: USERS_COLLECTION_NAME });
        return await dbConn.getOne({ query: { email } })
    }

    static async getById({ id }: { id: string }) {
        const dbConn = new dbConnection({ collectionName: USERS_COLLECTION_NAME });
        const _id = new ObjectId(id)
        return await dbConn.getOne({ query: { _id } })
    }

    static async findByIdAndUpdate(id: string, query: Record<string, object[]>) {
        const dbConn = new dbConnection({ collectionName: USERS_COLLECTION_NAME });
        const _id = new ObjectId(id)
        return await dbConn.findByIdAndUpdate(_id, query)
    }
}

export default UserModel;