import messageService from "./messagesServices.js";

const messageController = {};

messageController.addAction = (req, res) => {
    const { body } = req;

    messageService
        .addAction(body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

messageController.getByChannelPaginate = (req, res) => {
    const {
        params: { channel_id },
        query: { limit, page },
    } = req;

    messageService
        .getByChannelPaginate(channel_id, limit, page)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

export default messageController;
