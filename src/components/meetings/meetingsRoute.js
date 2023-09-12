import { Router } from "express";
import meetignController from "./meetingsController.js";

const meetingRoute = new Router();

meetingRoute.post("/", meetignController.addAction);
meetingRoute.get("/cron/inactive", meetignController.InactiveCron);
meetingRoute.get("/:channel_id", meetignController.getByChannel);

export default meetingRoute;
