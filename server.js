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
    response.send(appDetail[0]);
});

app.get("/addNewStory", function(request, response) {
    // read the file
    var fileContent = fileSys.readFileSync("./public/files/" + request.query.selectedAppId + ".json", "utf-8");
    // parse the array
    var storyArray = JSON.parse(fileContent);

    storyArray.push({
        "storyId": Date.now(),
        "storyLabel": request.query.storyLabel,
        "storyDescription": request.query.storyDescription,
        "storyType": request.query.storyType,
        "storyStatus": request.query.storyStatus,
        "storyAssignee": request.query.storyAssignee,
        "storyDeadline": request.query.storyDeadline
    });

    // write the file
    fileSys.writeFileSync("./public/files/" + request.query.selectedAppId + ".json", JSON.stringify(storyArray, null, 4));

    // read the file
    mFileContent = fileSys.readFileSync("./public/files/" + request.query.selectedAppId + ".json", "utf-8");

    response.send(mFileContent);
});

app.get("/updateStory", function(request, response) {
    // read the file
    var fileContent = fileSys.readFileSync("./public/files/" + request.query.mSelectedAppId + ".json", "utf-8");
    // parse the array
    var storyArray = JSON.parse(fileContent);

    var storyDetail = storyArray.filter(function(storyObj) {
        if (request.query.mStoryId.toString() === storyObj.storyId.toString())
            return storyObj;
    });

    storyDetail[0].storyLabel = request.query.mStoryLabel;
    storyDetail[0].storyDescription = request.query.mStoryDescription;
    storyDetail[0].storyType = request.query.mStoryType;
    storyDetail[0].storyStatus = request.query.mStoryStatus;
    storyDetail[0].storyAssignee = request.query.mStoryAssignee;
    storyDetail[0].storyDeadline = request.query.mStoryDeadline;


    // write the file
    fileSys.writeFileSync("./public/files/" + request.query.mSelectedAppId + ".json", JSON.stringify(storyArray, null, 4));

    // read the file
    mFileContent = fileSys.readFileSync("./public/files/" + request.query.mSelectedAppId + ".json", "utf-8");

    response.send(mFileContent);
});

app.get("/getAppStories", function(request, response) {
    var appId = request.query.appId;

    var fileContent = fileSys.readFileSync("./public/files/" + appId + ".json", "utf-8");
    response.send(fileContent);
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