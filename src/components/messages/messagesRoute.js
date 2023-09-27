import { Router } from "express";
import messageController from "./messagesController.js";
import uploadAWS from "../../config/aws.js";

const messagesRoute = new Router();

messagesRoute.post(
    "/",
    uploadAWS.array("file", 3),
    messageController.addAction
);
messagesRoute.post("/end", messageController.sendEndMessage);
messagesRoute.get("/:channel_id", messageController.getByChannelPaginate);

export default messagesRoute;
