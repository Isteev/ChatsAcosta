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
import { MeetignsModel } from "../meetings/meetingsModel.js";
import colaboratorServices from "../colaborator/colaboratorService.js";
import { ColaboratorModel } from "../colaborator/colaboratorsModel.js";
import { Sequelize } from "sequelize";

const messageService = {};

messageService.addAction = (body, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            delete body.id;
            const conn = await getRethinkDB();

            if (file) {
                body.url_file = file.location;
            }

            channelsService
                .getById(body.channel_id)
                .then(async ({ result: { data } }) => {
                    const newMessage = await MessagesModel.create({
                        ...body,
                        colaborator_id: data.colaborator_id,
                    });

                    if (newMessage) {
                        const colaborator = await colaboratorServices.getByid(
                            data.colaborator_id
                        );

                        const finalMessage = {
                            ...newMessage.dataValues,
                            colaborator:
                                colaborator.name + " " + colaborator.last_name,
                        };

                        r.table("messages")
                            .insert(finalMessage)
                            .run(conn, async (err, result) => {
                                if (err) reject(badreq(err.message));
                                else {
                                    resolve(success(newMessage));
                                }
                            });
                    } else {
                        reject(badreq("No fue posible enviar el mensaje"));
                    }
                })
                .catch((err) => {
                    reject(fatalError(err.message));
                });
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

messageService.sendEndMessage = async (body) => {
    try {
        const meeting = await MeetignsModel.findOne({
            where: {
                company_id: body.company_id,
                channel_id: body.channel_id,
                active: 1,
            },
            order: [["id", "DESC"]],
        });

        if (!meeting) {
            return badreq("No hay un meet activo");
        }

        meeting.active = 0;
        await meeting.save();

        body.meeting_id = meeting.id;

        const res = await messageService.addAction(body);
        return res;
    } catch (error) {
        return fatalError(error.message);
    }
};

messageService.getByChannelPaginate = (
    channel_id,
    limit = 10,
    currentPage = 1
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const messages = await MessagesModel.findAndCountAll({
                include: [
                    {
                        model: ColaboratorModel,
                        attributes: [
                            "name",
                            "last_name",
                            [
                                Sequelize.fn(
                                    "concat",
                                    Sequelize.col("name"),
                                    " ",
                                    Sequelize.col("last_name")
                                ),
                                "colaborator",
                            ],
                        ],
                    },
                ],
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
