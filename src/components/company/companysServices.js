import { badreq, fatalError, notfound, success } from "../../utils/utils.js";
import { CompanyModel } from "./companyModel.js";

const companysServices = {};

companysServices.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.create(body);

            if (company) {
                resolve(success(company));
            } else {
                reject(badreq("No fue posible crear la compañia"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

companysServices.getById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findByPk(id);

            if (company && company?.status == 1) {
                resolve(success(company));
            } else {
                reject(notfound("Esta compañia no exite"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

companysServices.deleteCompany = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findByPk(id, {
                attributes: ["id", "status"],
            });

            if (company) {
                company.status = 0;
                if (await company.save()) {
                    resolve(success(company));
                } else {
                    resolve(badreq("No fue posible eliminar la compañia"));
                }
            } else {
                reject(notfound("Esta compañia no exite"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

companysServices.getAllCompanies = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findAll({
                where: { status: 1 },
            });

            if (company) {
                resolve(success(company));
            } else {
                reject(notfound("No existe ninguna compañia"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

companysServices.changeActive = (id, active) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findByPk(id, {
                attributes: ["id", "status", "active"],
            });

            if (company && company?.status == 1) {
                company.active = active;
                if (await company.save()) {
                    resolve(success(company));
                } else {
                    resolve(badreq("No fue posible eliminar la compañia"));
                }
            } else {
                reject(notfound("Esta compañia no exite"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default companysServices;
