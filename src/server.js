const http = require('http');
const htmlHandler = require('./htmlresponse.js');
const jsonHandler = require('./response.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    const pathname = parsedUrl.pathname;

    if (request.method === 'GET' || request.method === 'HEAD') {
        if (pathname === '/' || pathname === '/client.html') {
            htmlHandler.getIndex(request, response);
        } else if (pathname === '/style.css') {
            htmlHandler.getCSS(request, response);
        } else if (pathname === '/getUsers') {
            jsonHandler.getUsers(request, response);
        } else if (pathname === '/notReal') {
            jsonHandler.notReal(request, response);
        } else {
            jsonHandler.notFound(request, response);
        }
    } else if (request.method === 'POST' && pathname === '/addUser') {
        jsonHandler.addUser(request, response);
    } else {
        jsonHandler.notFound(request, response);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});