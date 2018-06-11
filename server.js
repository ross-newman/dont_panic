const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var path = require('path');
var url = require('url');
var fs = require('fs');
var database_name = "name";
var mongodb_url = "mongodb://localhost:27017/" + database_name;

// Adding HTTPS encrypted connection
var https = require('https');
var privateKey = fs.readFileSync('sslcert/domain.key', 'utf8');
var certificate = fs.readFileSync('sslcert/domain.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

// Connection URL
const database_url = 'mongodb://localhost:27017';

// MongoDB Database Name
const dbName = 'names';

// Defult host name
const hostname = '127.0.0.1';

// Default port
const port = 3000;

// Turn on some debug
var DEBUG = 0;

// Turn on secure HTTPS (required certificate, openssl req -newkey rsa:2048 -nodes -keyout domain.key -x509 -days 365 -out domain.crt)
var SECURE = 1;

/**
 * Log a message if debug is enabled.
 * 
 * @param {String} msg - The message to send to console.log().
 */
function log(msg) {
    if (DEBUG) {
        console.log(msg);
    }
}

/**
 * Serve the requested file and.
 * 
 * @param {Object} res - HTTP server response object
 * @param {String} filename - Requested filename.
 */
function fileServer(res, filename) {
    log('File Server : ' + "http://" + hostname + ":" + port + "/" + filename.slice(1, filename.length));

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

/**
 * The /api REST interface. With no search field will return all objects.
 * 
 * @param {Object} res - HTTP server response object
 * @param {String} apiname - Search /api?search=joe.
 */
function apiServer(res, apiname) {
    log("API Request : " + apiname);
    var queryData = url.parse(apiname, true).query;

    // Check to see if the search key was included, if nmot return all results
    if (queryData.search == undefined) {
        // No search value
        MongoClient.connect(mongodb_url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(database_name);
            dbo.collection("customers").find({}, { projection: { _id: 0, name: 1 } }).toArray(function (err, result) {
                res.write(JSON.stringify(result));
                res.end();
            });
        });
    } else {
        // Search value provided
        log("API search : " + queryData.search);
        MongoClient.connect(mongodb_url, function (err, db) {
            if (err) throw err;
            var dbo = db.db(database_name);
            var search = queryData.search;
            log("API query : " + search);
            // TODO: Improve search. Search partial and last names
            dbo.collection("customers").find({ "name.first": new RegExp(search, "i") }, { projection: { _id: 0, name: 1 } }).toArray(function (err, result) {
                res.write(JSON.stringify(result));
                res.end();
            });
        });
    }
}

/**
 * The catch all #404 Page Not Found response.
 * 
 * @param {Object} res - HTTP server response object
 * @param {String} res - HTTP response object.
 */
function notFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('Simple name server, please use the prescribed RESTful API<br />');
    res.write('Error 404, page not found : \n' + req.url);
    res.end();
}

// Setup all the express routes
app.get('/', function (req, res) {
    fileServer(res, "/index.html");
});

app.get(/(^\/index.html|^\/js|^\/css)/, function (req, res) {
    log("Express : " + req.url)
    fileServer(res, req.url);
});

app.get(/(^\/bootstrap|^\/jquery|^\/angular|^\/restangular)/, function (req, res) {
    log("Express : " + req.url)
    fileServer(res, '/bower_components' + req.url);
});

app.get('/api', function (req, res) {
    apiServer(res, req.url);
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    notFound(req, res);
});

// Start the server, SECURE if certificates are in /sslcert/...
if (SECURE) {
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port);
    console.log(`Server running at https://${hostname}:${port}/`);
} else {
    // Now the routes are setup start listening
    app.listen(port, () => console.log(`Server running at http://${hostname}:${port}/`));
}
