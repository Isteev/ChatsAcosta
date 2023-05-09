import { v4 as uuidv4 } from "uuid";
import {
    badreq,
    fatalError,
    makeRequired,
    notfound,
    success,
} from "../../utils/utils.js";
import designServices from "../design/designServices.js";
import { CompanyModel } from "./companyModel.js";

const companysServices = {};

companysServices.addAction = async (body) => {
    try {
        const required = makeRequired(body, ["name", "email", "slug"]);

        if (required.length > 0) {
            reject(badreq("valores requeridos", required));
        }

        const validEmail = await CompanyModel.findOne({
            where: { status: 1, email: body.email },
            attributes: ["email"],
        });

        if (validEmail) {
            return badreq(`Este correo ya esta registrado`);
        }

        const validSlug = await CompanyModel.findOne({
            where: { status: 1, slug: body.slug },
            attributes: ["slug"],
        });

        if (validSlug) {
            return badreq(`Ya existe una compañia con este mismo slug`);
        }

        body.uuid = uuidv4();

        const company = await CompanyModel.create(body);

        if (company) {
            designServices.addAction({ company_id: company.id });

            return success(company);
        } else {
            reject(badreq("No fue posible crear la compañia"));
        }
    } catch (error) {
        return fatalError(error.message);
    }
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

companysServices.validCompany = (company_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findOne({
                where: { id: company_id, status: 1 },
                attributes: ["id", "active"],
            });

            if (!company) {
                reject(badreq(`la compañia con id ${company_id} no existe`));
            } else if (company.active == 0) {
                reject(
                    badreq(`la compañia con id ${company_id} no esta activa`)
                );
            } else {
                resolve(company);
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

companysServices.validCompanyUuid = (uuid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const company = await CompanyModel.findOne({
                where: { uuid: uuid, status: 1 },
                attributes: ["id", "active"],
            });

            if (!company) {
                reject(badreq(`la compañia con uuid ${uuid} no existe`));
            } else if (company.active == 0) {
                reject(badreq(`la compañia con uuid ${uuid} no esta activa`));
            } else {
                resolve(company);
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default companysServices;
