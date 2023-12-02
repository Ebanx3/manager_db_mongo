import { MongoClient, ObjectId } from "mongodb";
import config from "../config";

class dbConnection {
    private client;
    private db;
    private collection;

    constructor({ collectionName }: { collectionName: string }) {
        this.client = new MongoClient(config.MONGO_ATLAS_URI)
        this.db = this.client.db(config.DB_NAME);
        this.collection = this.db.collection(collectionName)
    }

    private async connecTDoDisconnect(method: Function) {
        try {
            await this.client.connect();
            const res = await method();
            await this.client.close();
            return res;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    async getAll() {
        return await this.connecTDoDisconnect(async () => await this.collection.find({}).toArray());
    }

    async create({ element }: { element: object }) {
        return await this.connecTDoDisconnect(async () => await this.collection.insertOne(element));
    }

    async getOne({ query }: { query: object }) {
        return await this.connecTDoDisconnect(async () => await this.collection.findOne(query))
    }
    async deleteAll() {
        if (process.env.NODE_ENV === "TEST") {
            return await this.connecTDoDisconnect(async () => await this.collection.deleteMany());
        }
    }

    async findByIdAndUpdate(_id: ObjectId, query: Record<string, object[]>) {
        const key = Object.keys(query)[0];
        const value = query[key];
        return await this.connecTDoDisconnect(async () => await this.collection.findOneAndUpdate({ _id }, { "$set": { [key]: value } }, { returnDocument: "after" }))
    }
}

export default dbConnection;