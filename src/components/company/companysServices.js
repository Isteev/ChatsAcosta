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

            if (company) {
                resolve(success(company));
            } else {
                reject(notfound("Esta compañia no exite"));
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default companysServices;
