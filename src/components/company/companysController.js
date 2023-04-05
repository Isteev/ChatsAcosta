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

export default companysController;
