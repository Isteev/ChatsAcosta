import companysServices from "./companysServices.js";

const companysController = {};

companysController.addAction = (req, res) => {
    const { body } = req;

    companysServices
        .addAction(body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

companysController.updateAction = (req, res) => {
    const {
        body,
        params: { id },
    } = req;

    companysServices
        .updateAction(id, body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

companysController.getAction = (req, res) => {
    const {
        params: { id },
    } = req;

    companysServices
        .getById(id)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

companysController.deleteCompany = (req, res) => {
    const {
        params: { id },
    } = req;

    companysServices
        .deleteCompany(id)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

companysController.getAllCompanies = (req, res) => {
    companysServices
        .getAllCompanies()
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

companysController.changeActive = (req, res) => {
    const {
        params: { id },
        body,
    } = req;

    companysServices
        .changeActive(id, body.active)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

export default companysController;
