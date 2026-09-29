const users = {};

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });

    if (request.method !== 'HEAD' && status !== 204) {
        response.write(JSON.stringify(object));
    }

    response.end();
};

const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };

    return respondJSON(request, response, 200, responseJSON);
};

const notReal = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found',
        id: 'notFound',
    };
    return respondJSON(request, response, 404, responseJSON);
};

const notFound = (request, response) => {
    // NOTE: this local variable used to be named "respondJSON", which shadowed
    // the respondJSON function above and crashed the server on every 404.
    const responseJSON = {
        message: 'The page you are looking for was not found',
        id: 'notFound',
    };
    return respondJSON(request, response, 404, responseJSON);
};

const addUser = (request, response) => {
    let body = '';

    request.on('data', (chunk) => {
        body += chunk;
    });

    request.on('end', () => {
        let name;
        let age;

        try {
            const parsed = JSON.parse(body);
            name = parsed.name;
            age = parsed.age;
        } catch {
            const responseJSON = {
                message: 'Request body must be valid JSON',
                id: 'invalidJson',
            };
            return respondJSON(request, response, 400, responseJSON);
        }

        if (!name || !age) {
            const responseJSON = {
                message: 'Name and age are both required',
                id: 'missingParams',
            };
            return respondJSON(request, response, 400, responseJSON);
        }

        const isUpdate = users[name] !== undefined;
        users[name] = age;

        if (isUpdate) {
            // respondJSON already skips writing a body when status is 204
            return respondJSON(request, response, 204, {});
        }

        const responseJSON = {
            message: 'User created',
            id: 'created',
        };
        return respondJSON(request, response, 201, responseJSON);
    });
};

module.exports = { getUsers, notReal, notFound, addUser };