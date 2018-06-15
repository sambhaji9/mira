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
    var data = fileSys.readFileSync("./public/files/index.json", "utf-8");
    // parse the array
    var projectArray = JSON.parse(data);
    projectArray.push({
        "appName": request.query.appName,
        "appVersion": request.query.appVersion,
        "appUpdateType": request.query.appUpdateType,
        "appId": request.query.appId,
        "date": new Date().toLocaleString()
    });
    // rewrite the index.json file
    fileSys.writeFileSync("./public/files/index.json", JSON.stringify(projectArray, null, 4));

    // write the details file
    fileSys.writeFile("./public/files/" + request.query.appId + ".json", "[]", function(err) {
        if (err)
            console.error(err);
    });

    response.send(getIndexJson());
});

app.get("/getAllApps", function(request, response) {
    response.send(getIndexJson());
});

app.get("/getAppDetail", function(request, response) {
    // get the apps and parse the list
    var allApps = JSON.parse(getIndexJson());

    var appId = request.query.appId;

    // filter and return the app object, matching the appId
    var appDetail = allApps.filter(function(app) {
        if (request.query.appId === app.appId)
            return app;
    });
    response.send(appDetail);
});

app.listen(1689, function() {
    console.log("Server listening on http://localhost:1689/");
});

/**
 * function reading and returning the index.json file
 * return {array}
 */
function getIndexJson() {
    return fileSys.readFileSync("./public/files/index.json", "utf-8");
}