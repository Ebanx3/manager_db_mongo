import { Router } from "express";
import { UserController } from "../controllers/user";
import authenticate from "../middlewares/authenticate";

const router = Router();

router.put("/addCollection", authenticate, UserController.addCollection);

export default router;