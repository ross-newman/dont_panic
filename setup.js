// This is a setup script to create the setup database with the requires startup data to get going
const readline = require('readline');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var database_name = "name";
var url = "mongodb://localhost:27017/" + database_name;

console.log("Performing setup tasks (Database " + database_name + ")");

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var names = new Array();
    var dbo = db.db(database_name);

    // Read the names in from a file
    var myInterface = readline.createInterface({
        input: fs.createReadStream('names.txt')
    });

    var lineno = 0;
    myInterface.on('line', function (line) {
        var res = line.split(" ");
        var aname = new Object();
        aname = JSON.parse('{"name":{"first":"' + res[0] + '" ,"last":"' + res[1] + '"}}');
        console.log(aname.toString());
        names[lineno] = aname;
        lineno++;
        console.log('Line number ' + lineno + ': ' + line);
        dbo.collection("customers").insertOne(aname, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
});

console.log("Done...");
