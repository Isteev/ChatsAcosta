import { badreq, fatalError, notfound, success } from "../../utils/utils.js";
import { CompanyModel } from "../company/companyModel.js";
import companysServices from "../company/companysServices.js";
import { DesignModel } from "./designModel.js";

const designServices = {};

designServices.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            companysServices
                .validCompany(body.company_id)
                .then(async () => {
                    const companyDesign = await DesignModel.findOne({
                        where: { company_id: body.company_id, status: 1 },
                    });

                    if (companyDesign) {
                        reject(badreq("La compañia ya tiene un diseño creado"));
                    } else {
                        const design = await DesignModel.create(body);

                        if (design) {
                            resolve(success(design));
                        } else {
                            reject(badreq("No fue posible crear el diseño"));
                        }
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

designServices.getByCompany = (company_id) => {
    return new Promise(async (resolve, reject) => {
        const design = await DesignModel.findOne({
            where: { company_id: company_id, status: 1 },
        });

        if (design) {
            resolve(success(design));
        } else {
            resolve(notfound("No se encontro diseño para esta compañia"));
        }
    });
};

designServices.updateAction = (body, company_id) => {
    return new Promise((resolve, reject) => {
        companysServices
            .validCompany(company_id)
            .then(async () => {
                delete body.company_id;

                const design = await DesignModel.update(body, {
                    where: {
                        company_id: company_id,
                    },
                });

                if (design) {
                    resolve(success(body));
                } else {
                    resolve(notfound("No se pudo actualizar el diseño"));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export default designServices;
