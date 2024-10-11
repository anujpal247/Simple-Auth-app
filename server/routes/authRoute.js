import { Router } from "express";
import { signupContoller } from "../controller/authController.js";

const authRouter = Router();

authRouter.post('/signup', signupContoller)

export default authRouter;