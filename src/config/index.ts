import dotenv from "dotenv";

dotenv.config();

let dbName = process.env.DB_NAME || "mongosrv";

const NodeEnv = process.env.NODE_ENV || "dev";

if (NodeEnv === "TEST") {
    dbName = process.env.DB_NAME_TESTS || "testsrv";
}
// console.log(`NODE_ENV=${NodeEnv}`)

export default {
    MONGO_ATLAS_URI: process.env.MONGO_ATLAS_URI || "",
    PORT: parseInt(process.env.PORT || "8080"),
    DB_NAME: dbName,
    NODE_ENV: NodeEnv,
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY
}