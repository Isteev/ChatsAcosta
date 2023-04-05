import { badreq, fatalError, notfound, success } from "../../utils/utils.js";
import { CompanyModel } from "../company/companyModel.js";
import { ColaboratorModel } from "./colaboratorsModel.js";

const colaboratorServices = {};

colaboratorServices.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            const colaboradors = await ColaboratorModel.findAll({
                where: { company_id: company_id },
                include: CompanyModel,
            });

            if (colaboradors) {
                resolve(success(colaboradors));
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

export default colaboratorServices;
