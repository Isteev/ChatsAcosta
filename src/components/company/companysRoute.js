import { Router } from "express";
import companysController from "./companysController.js";

const companysRouter = new Router();

companysRouter.post("/", companysController.addAction);
companysRouter.get("/all-companies", companysController.getAllCompanies);
companysRouter.put("/:id", companysController.changeActive);
companysRouter.put("/update/:id", companysController.updateAction);
companysRouter.get("/detail/:id", companysController.getAction);
companysRouter.delete("/:id", companysController.deleteCompany);

export default companysRouter;
