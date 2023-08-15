import { Router } from "express";
import messageController from "./messagesController.js";

const messagesRoute = new Router();

messagesRoute.post("/", messageController.addAction);
messagesRoute.post("/end", messageController.sendEndMessage);
messagesRoute.get("/:channel_id", messageController.getByChannelPaginate);

export default messagesRoute;
