import { Router } from "express";
import {
  signinController,
  signupContoller,
} from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/signup", signupContoller);
authRouter.post("/signin", signinController);

export default authRouter;
