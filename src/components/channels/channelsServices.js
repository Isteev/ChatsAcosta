import ioEmmit from "../../../index.js";
import { badreq, fatalError, notfound, success } from "../../utils/utils.js";
import colaboratorServices from "../colaborator/colaboratorService.js";
import companysServices from "../company/companysServices.js";
import userServices from "../user/userServices.js";
import { ChannelModel } from "./channelsModel.js";
import { DesignModel } from "../design/designModel.js";

//rethinkdb
import getRethinkDB from "../../config/rethinkdb.js";
import r from "rethinkdb";
import { MessagesModel } from "../messages/messagesModel.js";

const channelsService = {};

channelsService.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        companysServices
            .validCompanyUuid(body.company_uuid)
            .then((company) => {
                channelsService
                    .getChannelByUser(body.user_email, company.id)
                    .then((channel) => {
                        if (channel) {
                            resolve(success(channel));
                        } else {
                            userServices
                                .addAction({
                                    email: body.user_email,
                                    company_id: company.id,
                                })
                                .then(({ result: { data } }) => {
                                    const user = data;

                                    //get colaborator by company
                                    colaboratorServices
                                        .getFirstByCompany(company.id)
                                        .then(async ({ result: { data } }) => {
                                            if (data) {
                                                const channel =
                                                    await ChannelModel.create({
                                                        company_id: company.id,
                                                        colaborator_id: data,
                                                        user_id: user.id,
                                                        user_email:
                                                            body.user_email,
                                                    });

                                                ioEmmit({
                                                    to: `${data}${company.id}`,
                                                    data: channel,
                                                    key: "channel_by_colaborator",
                                                });

                                                if (channel) {
                                                    resolve(success(channel));
                                                } else {
                                                    reject(
                                                        badreq(
                                                            "No fue posible crear el channel"
                                                        )
                                                    );
                                                }
                                            } else {
                                                reject(
                                                    notfound(
                                                        "No hay colaboradores activos en este momento"
                                                    )
                                                );
                                            }
                                        })
                                        .catch((err) => {
                                            reject(badreq(err));
                                        });
                                })
                                .catch((err) => reject(badreq(err)));
                        }
                    })
                    .catch((err) => {
                        reject(badreq(err));
                    });
            })
            .catch((err) => reject(badreq(err)));
    });
};

channelsService.getById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const channel = await ChannelModel.findByPk(id);

            if (channel) {
                resolve(success(channel));
            } else {
                reject(notfound("No se entro un canal con este id"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

channelsService.getByColaborator = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const channels = await ChannelModel.findAll({
                where: { colaborator_id: id, status: 1 },
                order: [["id", "DESC"]],
                include: {
                    model: MessagesModel,
                    required: false,
                    as: "messages",
                    attributes: [
                        "content",
                        "type",
                        "message_status",
                        "message_user_type",
                        "channel_id",
                    ],
                    where: { status: 1 },
                    order: [["id", "DESC"]],
                    limit: 1,
                },
            });

            if (channels.length > 0) {
                resolve(success(channels));
            } else {
                reject(notfound("No hay canales para este usuario"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

channelsService.changesMessageByChannel = async () => {
    const conn = await getRethinkDB();

    r.table("messages")
        .changes()
        .run(conn, (err, cursor) => {
            if (err) console.log(err);
            else {
                cursor.each((err, row) => {
                    if (err) console.log(err);
                    else {
                        const message = row.new_val;
                        ioEmmit({
                            to: message.channel_id.toString(),
                            key: "send_message",
                            data: message,
                        });

                        ioEmmit({
                            to: `${message.colaborator_id}${message.company_id}`,
                            data: message,
                            key: "message_channel_by_colaborator",
                        });
                    }
                });
            }
        });
};

channelsService.getChannelByUser = async (user_email, company) => {
    return new Promise(async (resolve, reject) => {
        try {
            const channel = await ChannelModel.findOne({
                where: {
                    user_email: user_email,
                    company_id: company,
                    status: 1,
                },
            });

            if (!channel) {
                return resolve(null);
            }

            const active = await colaboratorServices.colaboratorIsActive(
                channel.colaborator_id
            );

            if (!active) {
                colaboratorServices
                    .getFirstByCompany(channel.company_id)
                    .then(async ({ result: { data } }) => {
                        const lastColaborator = channel.colaborator_id ;
                        channel.colaborator_id = data;
                        await channel.save();

                        ioEmmit({
                            to: `${data}${channel.company_id}`,
                            data: channel,
                            key: "channel_by_colaborator",
                        });

                        ioEmmit({
                            to: `${lastColaborator}${channel.company_id}`,
                            data: channel.id,
                            key: "reasign_channel_by_colaborator",
                        });

                        resolve(channel);
                    })
                    .catch((e) => reject(e));
            } else {
                resolve(channel);
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default channelsService;
