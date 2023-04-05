import { Router } from "express";
import companysController from "./companysController.js";

const companysRouter = new Router();

companysRouter.post("/", companysController.addAction);

export default companysRouter;
