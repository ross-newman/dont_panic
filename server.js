const http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var database_name = "name";
var mongodb_url = "mongodb://localhost:27017/" + database_name;

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

function apiServer(res, apiname) {
    console.log("API Request : " + apiname);
    var queryData = url.parse(apiname, true).query;

    if (queryData.search == undefined) {
        MongoClient.connect(mongodb_url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(database_name);
            dbo.collection("customers").find({}, { projection: { _id: 0, name: 1 } }).toArray(function (err, result) {
                res.write(JSON.stringify(result));
                res.end();
            });
        });
    } else {
        console.log("API search : " + queryData.search);
        MongoClient.connect(mongodb_url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(database_name);
            var query = "{ \"name.first\" : \"" + queryData.search + "\"}";
            console.log("API query : " + query);
            dbo.collection("customers").find(JSON.parse(query), { projection: { _id: 0, name: 1 } }).toArray(function (err, result) {
                res.write(JSON.stringify(result));
                res.end();
            });
        });
    }
}

// TODO: Replace http with express
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
            case 'angular':
            case 'restangular':
                fileServer(res, '/bower_components' + req.url);
                break;
            case 'index.html':
            case 'js':
            case 'css':
                fileServer(res, req.url);
                break;
            case 'api':
                apiServer(res, req.url);
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



