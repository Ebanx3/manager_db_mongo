import config from "../config";
import express, { Request, Response } from "express";
import mainRouter from "../routes";
import http from "node:http"

class Server {
    private static instance: Server;
    static app = express();
    static server: http.Server;

    private constructor() {
        Server.app.use(express.json());
        Server.app.use("/api", mainRouter);
        Server.app.use((req: Request, res: Response) => {
            res.status(404).json({ message: "Undefined path" })
        })
        if (config.NODE_ENV !== "TEST")
            Server.server = Server.app.listen(config.PORT, () => {
                console.log("Server ready, listening at port", config.PORT);
            });
    }

    public static getInstance() {
        if (Server.instance == null) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    static getApp() {
        return Server.app;
    }

    static close() {
        Server.server.close();
    }
}

export default Server;