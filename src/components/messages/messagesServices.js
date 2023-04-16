import {
    badreq,
    fatalError,
    success,
    successPaginate,
} from "../../utils/utils.js";
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

messageService.getByChannelPaginate = (
    channel_id,
    limit = 10,
    currentPage = 1
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const messages = await MessagesModel.findAndCountAll({
                where: {
                    channel_id: channel_id,
                },
                order: [["id", "desc"]],
                limit: parseInt(limit),
                offset: limit * (currentPage - 1),
            });

            const itemCount = messages.count;
            const pageCount = Math.ceil(itemCount / limit);

            resolve(
                successPaginate(
                    messages.rows,
                    currentPage < pageCount,
                    pageCount,
                    messages.count
                )
            );
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default messageService;
