import { badreq, fatalError, notfound, success } from "../../utils/utils.js";
import { CompanyModel } from "../company/companyModel.js";
import { ColaboratorModel } from "./colaboratorsModel.js";

const colaboratorServices = {};

colaboratorServices.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findOne({
                where: { id: body?.company_id, status: 1 },
                attributes: ["id", "active"],
            });

            if (!company) {
                reject(
                    notfound(`La compañia con id ${body?.company_id} no existe`)
                );
            }

            if (company?.active == 0) {
                reject(
                    notfound(
                        `La compañia con id ${body?.company_id} se encuentra inactiva`
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
            const colaborator = await ColaboratorModel.findOne({
                where: {
                    company_id: company_id,
                    status: 1,
                },
            });

            if (colaborator) {
                resolve(success(colaborator));
            } else {
                reject(
                    notfound("No hay colaboradores activos en esta compañia")
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
                where: { company_id: company_id, status: 1 },
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

export default colaboratorServices;
