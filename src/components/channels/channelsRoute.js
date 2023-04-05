import { Router } from "express";
import channelController from "./channelsController.js";

const channelsRouter = new Router();

channelsRouter.post("/", channelController.addAction);
channelsRouter.get("/:colaborator_id", channelController.getByColaborator);

export default channelsRouter;
