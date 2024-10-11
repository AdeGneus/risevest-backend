import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { deserializeUser } from "../middlewares/deserializeUser";

const userRouter = Router();

userRouter.use(deserializeUser);

userRouter.get("/", getAllUsers);

export default userRouter;
