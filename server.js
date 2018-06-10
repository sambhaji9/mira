// load the required modules
var express = require("express");
var app = express();

var fileSys = require("fs");

// serve the static files from public folder
app.use(express.static("public"));

app.get("/", function(request, response) {
    response.send(__dirname + "/index.html");
});

app.get("/createNewAppVersion", function(request, response) {
    console.log(request.query.appVersion);
    fileSys.readFile("./public/files/index.json", "utf-8", function(err, data) {
        // parse the array
        var projectArray = JSON.parse(data);
        projectArray.push({
            "appName": request.query.appName,
            "appVersion": request.query.appVersion,
            "updateType": request.query.updateType
        });
        console.log(projectArray);
        fileSys.writeFile("./public/files/index.json", JSON.stringify(projectArray, null, 4), function(err) {
            if (err) console.log("Unable to write index.json file");
        });
    });
});

app.listen(1689, function() {
    console.log("Server listening on http://localhost:1689/");
});