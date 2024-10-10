import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";

import { validateData } from "../middlewares/validateData";
import { userSignUpSchema } from "../schemas/user";

const authRouter = Router();

authRouter.post("/register", validateData(userSignUpSchema), registerUser);

export default authRouter;
