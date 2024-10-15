import { Router } from "express";
import {
  forgotPasswordController,
  getUserController,
  logoutController,
  resetPasswordController,
  signinController,
  signupContoller,
} from "../controller/authController.js";
import jwtAuth from "../middleware/jwtAuth.js";

const authRouter = Router();

authRouter.post("/signup", signupContoller);
authRouter.post("/signin", signinController);
authRouter.post("/forgotPassword", forgotPasswordController);
authRouter.post("/resetpassword/:token", resetPasswordController);

authRouter.get("/logout", jwtAuth, logoutController);
authRouter.get("/user", jwtAuth, getUserController);

export default authRouter;
