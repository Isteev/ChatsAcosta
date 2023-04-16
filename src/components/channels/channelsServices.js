import ioEmmit from "../../../index.js";
import { badreq, fatalError, notfound, success } from "../../utils/utils.js";
import colaboratorServices from "../colaborator/colaboratorService.js";
import companysServices from "../company/companysServices.js";
import { ChannelModel } from "./channelsModel.js";

//rethinkdb
import getRethinkDB from "../../config/rethinkdb.js";
import r from "rethinkdb";

const channelsService = {};

channelsService.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            //valid company by uuid
            companysServices
                .validCompanyUuid(body.company_uuid)
                .then((company) => {
                    channelsService
                        .getChannelByUser(body.user_id)
                        .then((channel) => {
                            if (channel) {
                                resolve(success(channel));
                            } else {
                                //get colaborator by company
                                colaboratorServices
                                    .getFirstByCompany(company.id)
                                    .then(async ({ result: { data } }) => {
                                        if (data) {
                                            const channel =
                                                await ChannelModel.create({
                                                    company_id: company.id,
                                                    colaborator_id: data.id,
                                                    user_id: body.user_id,
                                                });

                                            ioEmmit({
                                                to: `${data.id}${company.id}`,
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
                                                    "No hay colaboradores activos en esta compañia"
                                                )
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => reject(err));
        } catch (error) {
            reject(fatalError(error.message));
        }
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
                where: { colaborator_id: id },
                order: [["id", "DESC"]],
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
                    }
                });
            }
        });
};

channelsService.getChannelByUser = async (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const channel = await ChannelModel.findOne({
                where: { user_id: user_id },
            });

            resolve(channel);
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default channelsService;
