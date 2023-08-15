import { Router } from "express";
import colaboratorController from "./colaboratorController.js";

const colaboratorRouter = new Router();

colaboratorRouter.post("/", colaboratorController.addAction);
colaboratorRouter.get(
    "/get-by-company/:company",
    colaboratorController.getByCompany
    );
colaboratorRouter.get("/:id", colaboratorController.detail);
colaboratorRouter.delete("/:id", colaboratorController.deleteColaborator);
colaboratorRouter.put("/set-status/:id", colaboratorController.setActiveStatus);

export default colaboratorRouter;
