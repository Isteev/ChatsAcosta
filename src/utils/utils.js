// response model

export const success = (data) => {
    return {
        status: 200,
        result: {
            status: "success",
            data: data,
        },
    };
};

export const successPaginate = (data, hasNext, pageCount, count) => {
    return {
        status: 200,
        result: {
            status: "success",
            data: data,
            hasNext,
            pageCount,
            count,
        },
    };
};

export const fatalError = (message) => {
    return {
        status: 500,
        result: {
            status: "error",
            message: message,
        },
    };
};

export const notfound = (message) => {
    return {
        status: 404,
        result: {
            status: "error",
            message: message,
        },
    };
};

export const unauth = (message = "token no valido") => {
    return {
        status: 401,
        result: {
            status: "error",
            message: message,
        },
    };
};

export const badreq = (message = "error", data) => {
    return {
        status: 400,
        result: {
            status: "error",
            message: message,
            data,
        },
    };
};

export const makeRequired = (value, keys) => {
    const response = [];

    keys.forEach((element) => {
        if (!value[element]) response.push(`${element} es requerido`);
    });

    return response;
};
