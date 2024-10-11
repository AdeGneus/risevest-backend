import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller";
import { deserializeUser } from "../middlewares/deserializeUser";

const userRouter = Router();

userRouter.use(deserializeUser);

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

export default userRouter;
