const http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const database_url = 'mongodb://localhost:27017';

// MongoDB Database Name
const dbName = 'names';

/**
 * The default hostname of the server 
 * @constant
 * @type {string}
 * @default 
 */
const hostname = '127.0.0.1';

/** 
 * \var port 
 * \brief The default port number of the server 
 */
const port = 3000;

/**
 * Enable some additional debugging featured to be enabled 
 */
var DEBUG = 1;

/**
 *  \brief Add a new asset to the database.
 * 
 * @param {Object} res - HTTP server response object
 * @param {String} filename - Requested filename.
 */
function fileServer(res, filename) {
    if (DEBUG) {
        console.log('File Server : ' + "http://" + hostname + ":" + port + filename.slice(1, filename.length));
    }
    var filePath = "." + filename;
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/ico';
            break;
    }

    fs.readFile(filePath, function (err, data) {
        if (err) {
            fs.readFile("./404.html", function (e, data404) {
                if (e) {
                    return res.end('404 Not Found');
                }
                res.write(data404);
                return res.end();
            });
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(data);
            return res.end();
        }
    });
    return;
}

// Use connect method to connect to the server
MongoClient.connect(database_url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    client.close();
});

const server = http.createServer(function (req, res) {
    const u = url.parse(req.url);
    console.log("Page request: " + req.url);
    var array = u.pathname.split('/');

    if (array.length > 0) {
        /* Database exists so process pages normally */
        switch (array[1]) {
            case 'name':
                res.writeHead(200, { 'Content-Type': 'text/html' });
                search_name(mypage);
                break;
            case 'bootstrap':
            case 'jquery':
                fileServer(res, '/bower_components' + req.url);
                break;
            case 'index.html':
                fileServer(res, req.url);
                break;
            case '': // Go to the home page
            default:
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write('Simple name server, please use the prescribed RESTful API<br />');
                res.write('Error 404, page not found : \n' + req.url);
                res.end();
        }
    }
});

/* Now listen to server */
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



