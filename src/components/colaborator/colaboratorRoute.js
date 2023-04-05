import { Router } from "express";
import colaboratorController from "./colaboratorController.js";

const colaboratorRouter = new Router();

colaboratorRouter.post("/", colaboratorController.addAction);
colaboratorRouter.get("/:company", colaboratorController.getByCompany);

export default colaboratorRouter;
