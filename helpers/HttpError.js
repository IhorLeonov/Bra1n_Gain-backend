const errorMessageList = {
    400: 'Bad Request',
    401: 'Not authorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
};

class HttpError extends Error {
    constructor(status, message) {
        super(message || errorMessageList[status]);
        this.status = status;
    }
}

module.exports = HttpError;
