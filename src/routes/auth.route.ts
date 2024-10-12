import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

import { validateData } from "../middlewares/validateData";
import { loginSchema, userSignUpSchema } from "../schemas/user";

const authRouter = Router();

authRouter.post("/register", validateData(userSignUpSchema), registerUser);
authRouter.post("/login", validateData(loginSchema), loginUser);

export default authRouter;
