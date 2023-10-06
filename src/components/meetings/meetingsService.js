import ioEmmit from "../../../index.js";
import { sequelizeConn } from "../../config/sequalize.js";
import { badreq, fatalError, success } from "../../utils/utils.js";
import messageService from "../messages/messagesServices.js";
import { MeetignsModel } from "./meetingsModel.js";

const meetingService = {};

meetingService.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const meetign = await MeetignsModel.create(body);

            if (meetign) {
                ioEmmit({
                    to: body.channel_id.toString(),
                    key: "new-meeting",
                    data: meetign,
                });

                resolve(success(meetign));
            } else {
                reject(badreq("No fue posible crear el meeting"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

meetingService.getByChannel = (channel_id, send_message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const meetign = await MeetignsModel.findOne({
                where: { channel_id: channel_id, active: 1 },
            });

            if (meetign) {
                resolve(success(meetign));
            } else if (send_message == 'send') {
                messageService.sendWelcomeMessage(channel_id)
                    .catch(() => { })
                    .finally(() => reject(badreq("No hay meetings activos con este canal")));
            } else {
                reject(badreq("No hay meetings activos con este canal"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

meetingService.InactiveCron = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const meetings = await sequelizeConn.query(
                "SELECT m.* FROM chats.channels as c \
                INNER JOIN chats.meetigns as m on c.id = m.channel_id \
                where \
                (SELECT count(1) as cou FROM chats.messages where channel_id = c.id AND createdAt > NOW() - INTERVAL 15 MINUTE) = 0 \
                AND m.active = 1 \
                order by m.id;",
                {
                    model: MeetignsModel,
                    mapToModel: true,
                }
            );

            if (meetings) {
                meetings.forEach((v) => {
                    v.active = 0;
                    v.save();

                    ioEmmit({ to: `meet-${v.id}`, key: "close_meet", data: 1 });
                });

                resolve(success(meetings.map((v) => v.id)));
            } else {
                reject(badreq("error"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default meetingService;
