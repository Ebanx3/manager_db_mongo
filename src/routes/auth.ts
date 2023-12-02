import { Router } from "express";
import { UserController } from "../controllers/user";
import { validateUserData } from "../middlewares/validateUserData";

const router = Router();

router.post("/signup", validateUserData, UserController.signup)
router.post("/login", validateUserData, UserController.login)

export default router;