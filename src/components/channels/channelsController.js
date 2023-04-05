import channelsService from "./channelsServices.js";

const channelController = {};

channelController.addAction = (req, res) => {
    const { body } = req;

    channelsService
        .addAction(body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

channelController.getByColaborator = (req, res) => {
    const {
        params: { colaborator_id },
    } = req;

    channelsService
        .getByColaborator(colaborator_id)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

export default channelController;
