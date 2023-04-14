import express from "express";
import bodyParser from "body-parser";
import http from "http";
import "dotenv/config.js";

//config
import { sequelizeConn } from "./src/config/sequalize.js";
import { Server } from "socket.io";

//apis
import messagesRoute from "./src/components/messages/messagesRoute.js";
import channelsRouter from "./src/components/channels/channelsRoute.js";
import companysRouter from "./src/components/company/companysRoute.js";
import colaboratorRouter from "./src/components/colaborator/colaboratorRoute.js";

//services
import channelsService from "./src/components/channels/channelsServices.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//apis
app.use("/messages", messagesRoute);
app.use("/channels", channelsRouter);
app.use("/company", companysRouter);
app.use("/colaborator", colaboratorRouter);

app.get("/", (_, res) => {
    res.send("The server is Ok");
});

//init socket
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// socket middleware
io.use((socket, next) => {
    console.log("----->Socket iniciado");
    if (!socket.request) {
        const err = new Error("error");
        err.data = { content: "Not socket request" };
        next(err);
    } else {
        next();
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join", (room) => {
        console.log("room", room);
        socket.join(room.toString());
    });

    socket.on("pingpong", () => {
        socket.emit("pong", 1);
    });

    socket.on("leave_channel", (room) => {
        socket.leave(room.toString());
    });

    socket.on("disconnect", () => {
        console.log("disconnect");
        socket.disconnect(true);
    });
});

//init changes
channelsService.changesMessageByChannel();

sequelizeConn.sync({ alter: false });

server.listen(3000, () => {
    console.log("server is running on port " + 3000);
});

function ioEmmit({ key, data, to }) {
    if (to) {
        io.to(to).emit(key, data);
    } else {
        io.emit(key, data);
    }
}

export default ioEmmit;
