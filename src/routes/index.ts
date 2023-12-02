import { Router } from "express";
import AuthRouter from "./auth";
import UserRouter from "./user";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);

export default router;