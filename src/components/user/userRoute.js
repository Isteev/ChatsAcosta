import { Router } from "express";
import controller from "./userController.js";

const userRoute = new Router();

userRoute.post("/", controller.addAction);

export default userRoute;
