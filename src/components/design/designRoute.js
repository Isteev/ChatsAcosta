import { Router } from "express";
import designController from "./designController.js";

const designRoute = new Router();

designRoute.post("/", designController.addAction);
designRoute.get("/:company_id", designController.getByCompany);
designRoute.put("/:company_id", designController.updateAction);

export default designRoute;
