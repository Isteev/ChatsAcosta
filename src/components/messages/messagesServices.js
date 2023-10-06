import {
    badreq,
    fatalError,
    success,
    successPaginate,
} from "../../utils/utils.js";
import channelsService from "../channels/channelsServices.js";
import colaboratorServices from "../colaborator/colaboratorService.js";
import companysServices from "../company/companysServices.js";
//models
import { MessagesModel } from "./messagesModel.js";
import { MeetignsModel } from "../meetings/meetingsModel.js";
import { ColaboratorModel } from "../colaborator/colaboratorsModel.js";
import { Sequelize } from "sequelize";

//rethinkdb
import getRethinkDB from "../../config/rethinkdb.js";
import r from "rethinkdb";

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

messageService.sendWelcomeMessage = async (channel_id) => {
    try {
        const { result: { data } } = await channelsService.getById(channel_id);

        if (!data) return badreq('no existe ese canal');

        const { result } = await companysServices.getById(data.company_id);

        if (!result.data.welcome_message) return badreq('No hay welcome_message definido')

        const bodyMessage = {
            content: result.data.welcome_message,
            type: 1,
            user_id: data.user_id,
            channel_id: channel_id,
            colaborator_id: data.colaborator_id,
            company_id: result.data.id,
            message_user_type: 'colaborator',
            createdAt: new Date().toISOString()
        }

        const res = await messageService.addAction(bodyMessage);
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
