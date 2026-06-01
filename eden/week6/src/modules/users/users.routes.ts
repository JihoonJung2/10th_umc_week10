import { Router } from "express";
import { handleUserSignUp } from "./controllers/user.controllers.js";

const usersRouter = Router();

//회원가입
usersRouter.post("/users/signup", handleUserSignUp);


export default usersRouter;