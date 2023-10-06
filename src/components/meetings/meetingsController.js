import meetingService from "./meetingsService.js";

const meetignController = {};

meetignController.addAction = (req, res) => {
    const { body } = req;

    meetingService
        .addAction(body)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

meetignController.getByChannel = (req, res) => {
    const {
        params: { channel_id },
        query: { send_message }
    } = req;

    meetingService
        .getByChannel(channel_id, send_message)
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

meetignController.InactiveCron = (req, res) => {
    meetingService
        .InactiveCron()
        .then(({ status, result }) => {
            res.status(status).send(result);
        })
        .catch(({ status, result }) => {
            res.status(status).send(result);
        });
};

export default meetignController;
