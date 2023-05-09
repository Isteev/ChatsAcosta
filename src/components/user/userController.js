import userServices from "./userServices.js";

const controller = {};

controller.addAction = (req, res) => {
    const { body } = req;

    userServices
        .addAction(body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

export default controller;
