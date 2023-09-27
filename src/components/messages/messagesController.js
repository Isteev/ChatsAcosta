import messageService from "./messagesServices.js";

const messageController = {};

messageController.addAction = (req, res) => {
    const { files, body } = req;

    let file = null;
    if (files && files.length > 0) {
        file = files[0];
    }

    messageService
        .addAction(body, file)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

messageController.sendEndMessage = (req, res) => {
    const { body } = req;

    messageService
        .sendEndMessage(body)
        .then(({ status = 200, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status = 500, result }) => {
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
