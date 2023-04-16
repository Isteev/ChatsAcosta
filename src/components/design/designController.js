import designServices from "./designServices.js";

const designController = {};

designController.addAction = (req, res) => {
    const { body } = req;

    designServices
        .addAction(body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

designController.getByCompany = (req, res) => {
    const {
        params: { company_id },
    } = req;

    designServices
        .getByCompany(company_id)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

designController.updateAction = (req, res) => {
    const {
        body,
        params: { company_id },
    } = req;

    designServices
        .updateAction(body, company_id)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

export default designController;
