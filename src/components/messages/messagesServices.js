import ioEmmit from "../../../index.js";
import { badreq, fatalError, success } from "../../utils/utils.js";
import channelsService from "../channels/channelsServices.js";
import { MessagesModel } from "./messagesModel.js";

//rethinkdb
import getRethinkDB from "../../config/rethinkdb.js";
import r from "rethinkdb";

const messageService = {};

messageService.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const conn = await getRethinkDB();

            channelsService
                .getById(body.channel_id)
                .then(async ({ result: { data } }) => {
                    const newMessage = await MessagesModel.create({
                        ...body,
                        colaborator_id: data.colaborator_id,
                    });

                    if (newMessage) {
                        r.table("messages")
                            .insert(newMessage.dataValues)
                            .run(conn, async (err, result) => {
                                if (err) reject(badreq(err.message));
                                else {
                                    resolve(success(newMessage));
                                }
                            });
                    } else {
                        reject("No fue posible enviar el mensaje");
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default messageService;
