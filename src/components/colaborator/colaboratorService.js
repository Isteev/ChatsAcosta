import { Op, QueryTypes } from "sequelize";
import { badreq, fatalError, notfound, success } from "../../utils/utils.js";
import { CompanyModel } from "../company/companyModel.js";
import { ColaboratorModel } from "./colaboratorsModel.js";
import { sequelizeConn } from "../../config/sequalize.js";

const colaboratorServices = {};

colaboratorServices.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findOne({
                where: { id: body?.company_id, status: 1 },
                attributes: ["id", "active"],
            });

            if (!company) {
                return reject(
                    notfound(`La compañia con id ${body?.company_id} no existe`)
                );
            }

            if (company?.active == 0) {
                return reject(
                    notfound(
                        `La compañia con id ${body?.company_id} se encuentra inactiva`
                    )
                );
            }

            const found = await ColaboratorModel.findOne({
                where: {
                    company_id: company.id,
                    document: body.document,
                    status: 1,
                },
            });

            if (found) {
                return reject(
                    notfound(
                        `Ya existe un usuario con este documento en la compañia.`
                    )
                );
            }

            const colaborator = await ColaboratorModel.create(body);

            if (colaborator) {
                resolve(success(colaborator));
            } else {
                reject(badreq("No fue posible crear el colaborador"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

colaboratorServices.getFirstByCompany = (company_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await sequelizeConn.query(
                `SELECT count(ch.id) as count, c.id FROM chats.colaborators as c
                left join chats.channels as ch on c.id = ch.colaborator_id
                where c.status = 1 and c.company_id = ${company_id} and profile_id = 1 and active = 1
                group by c.id
                order by count`,
                {
                    type: QueryTypes.SELECT,
                }
            );

            if (result.length > 0) {
                resolve(success(result[0]["id"]));
            } else {
                reject(
                    notfound("No hay colaboradores activos en este momento")
                );
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

colaboratorServices.getByCompany = (company_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colaborator = await ColaboratorModel.findAll({
                where: { company_id: company_id, status: 1, profile_id: 1 },
                include: [CompanyModel],
            });

            if (colaborator) {
                resolve(success(colaborator));
            } else {
                reject(
                    notfound("No existe ningun colaborador con esa compañia")
                );
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

colaboratorServices.deleteColaborator = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colaborator = await ColaboratorModel.findByPk(id);

            if (colaborator && colaborator?.status == 1) {
                colaborator.status = 0;
                if (await colaborator.save()) {
                    resolve(success(colaborator));
                } else {
                    resolve(badreq("No fue posible eliminar el colaborador"));
                }
            } else {
                reject(
                    notfound("No existe ningun colaborador con esa compañia")
                );
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

colaboratorServices.detail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const colaborator = await ColaboratorModel.findByPk(id);

            if (colaborator && colaborator?.status == 1) {
                resolve(success(colaborator));
            } else {
                reject(notfound("No existe ningun colaborador"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

colaboratorServices.colaboratorIsActive = async (id) => {
    const colaborator = await ColaboratorModel.findOne({
        where: { id: id, status: 1, active: 1 },
    });

    if (colaborator) {
        return true;
    } else {
        return false;
    }
};

colaboratorServices.setActiveStatus = async (id, body) => {
    try {
        const colaborator = await ColaboratorModel.findOne({
            where: { id: id, status: 1 },
        });

        if (!colaborator) {
            return badreq("Colaborador no existe");
        }

        colaborator.active = body.active;
        await colaborator.save();

        return success(colaborator);
    } catch (error) {
        return fatalError(error.message);
    }
};

colaboratorServices.getByid = async (id) => {
    try {
        const colaborator = await ColaboratorModel.findOne({
            where: { id: id, status: 1 },
        });

        return colaborator;
    } catch (error) {
        return fatalError(error.message);
    }
};


export default colaboratorServices;
