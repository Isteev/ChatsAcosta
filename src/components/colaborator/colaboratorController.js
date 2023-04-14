import colaboratorServices from "./colaboratorService.js";

const colaboratorController = {};

colaboratorController.addAction = (req, res) => {
    const { body } = req;

    colaboratorServices
        .addAction(body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

colaboratorController.getByCompany = (req, res) => {
    const {
        params: { company },
    } = req;

    colaboratorServices
        .getByCompany(company)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

colaboratorController.deleteColaborator = (req, res) => {
    const {
        params: { id },
    } = req;

    colaboratorServices
        .deleteColaborator(id)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

colaboratorController.detail = (req, res) => {
    const {
        params: { id },
    } = req;

    colaboratorServices
        .detail(id)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

export default colaboratorController;
