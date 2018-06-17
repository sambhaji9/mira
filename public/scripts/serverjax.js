var storyList = [];

// selected app object
var selectedApp = {};

// storyID
var storyId = "";

$(document).ready(function() {

    showAllAppsList();

    var appName = document.getElementById("appName");
    var appVersion = document.getElementById("appVersion");
    var appUpdateType = document.getElementById("appUpdateType");
    var appId = document.getElementById("appId");

    var newAppButton = document.getElementById("saveNewApp");
    newAppButton.addEventListener("click", function() {
        // hide the modal
        $("#newAppModal").modal('hide');

        if (appId !== "") {
            var newApp = addNewApp(appName.value, appVersion.value, appUpdateType.value, appId.value);
        } else
            new Messages("Please fill all fields").showMessage();

    });

    // focus on first input, appName in NewAppModal, when shown
    $("#newAppModal").on("shown.bs.modal", function() {
        $("#appName").trigger("focus");
    });

    $("#newStoryModal").on("shown.bs.modal", function() {
        $("#storyLabel").trigger("focus");
    });

    $("#appUpdateType").on("change", function() {
        if (appName.value !== "" && appVersion.value !== "" && appUpdateType.value !== "")
            generateAppId();
    });

    $("#appName").on("blur", function() {
        if (appName.value !== "" && appVersion.value !== "" && appUpdateType.value !== "")
            generateAppId();
    });

    $("#appVersion").on("blur", function() {
        if (appName.value !== "" && appVersion.value !== "" && appUpdateType.value !== "")
            generateAppId();
    });

    $("#leftPane").on("click", ".app-text", function() {
        // get the details of the selected app in left pane
        selectedAppId = $(this).closest("p").attr("id");
        getAppDetail(selectedAppId);
    });

    $("#saveNewStory").on("click", function() {
        // hide the modal
        $("#newStoryModal").modal('hide');

        var storyLabel = document.getElementById("storyLabel");
        var storyDescription = document.getElementById("storyDescription");
        var storyType = document.getElementById("storyType");
        var storyStatus = document.getElementById("storyStatus");
        var storyAssignee = document.getElementById("storyAssignee");
        var storyDeadline = document.getElementById("storyDeadline");

        $.ajax({
            url: "http://127.0.0.1:1689/addNewStory",
            data: {
                "selectedAppId": selectedApp.appId,
                "storyLabel": storyLabel.value,
                "storyDescription": storyDescription.value,
                "storyType": storyType.value,
                "storyStatus": storyStatus.value,
                "storyAssignee": storyAssignee.value,
                "storyDeadline": storyDeadline.value,
            },
            success: function(result) {
                // show the stories in the middle pane
                showStoryList(result);
            }
        });
    });

    $("#newStory").on("click", function() {
        $("#newStoryModal").modal({
            backdrop: 'static',
            keyboard: false
        });
    });

    $("#mStoryTable").on("click", "td:first-child", function(event) {
        storyId = $(this).closest("tr").attr("id");

        // stories length
        var sLength = storyList.length;
        var appDetails = {};

        // iterate over the storyList and find the object
        for (var story = 0; story < sLength; story++) {
            if ((storyList[story].storyId).toString() === storyId) {
                appDetails = storyList[story];
                break;
            }
        }

        // show the newStoryModal and fill the relevant fields
        $("#updateStoryModal").modal({
            backdrop: 'static',
            keyboard: false
        });

        // load the values from the JSON file
        document.getElementById("mStoryLabel").value = appDetails.storyLabel;
        document.getElementById("mStoryDescription").value = appDetails.storyDescription;
        document.getElementById("mStoryType").value = appDetails.storyType;
        document.getElementById("mStoryStatus").value = appDetails.storyStatus;
        document.getElementById("mStoryAssignee").value = appDetails.storyAssignee;
        document.getElementById("mStoryDeadline").value = appDetails.storyDeadline;
    });

    $("#updateStory").on("click", function() {
        // hide the modal
        $("#updateStoryModal").modal('hide');

        $.ajax({
            url: "http://127.0.0.1:1689/updateStory",
            data: {
                "mStoryId": storyId,
                "mSelectedAppId": selectedApp.appId,
                "mStoryLabel": document.getElementById("mStoryLabel").value,
                "mStoryDescription": document.getElementById("mStoryDescription").value,
                "mStoryType": document.getElementById("mStoryType").value,
                "mStoryStatus": document.getElementById("mStoryStatus").value,
                "mStoryAssignee": document.getElementById("mStoryAssignee").value,
                "mStoryDeadline": document.getElementById("mStoryDeadline").value,
            },
            success: function(result) {
                // show the stories in the middle pane
                showStoryList(result);
            }
        });
    });
});

document.onkeyup = function(e) {
    if (e.ctrlKey && e.shiftKey && e.which === 79) {
        // hide the left pane
        $("#leftPane").hide();
    } else if (e.ctrlKey && e.shiftKey && e.which === 80) {
        // show the left pane
        $("#leftPane").show();
    }
};


/**
 * function showing the list of story in middle pane
 * @param {array} storyArray 
 */
function showStoryList(storyArray) {
    storyList = JSON.parse(storyArray);
    // get the size of stories
    var mLength = storyList.length;

    // get reference to storyTable
    var storyTable = document.getElementById("storyTable");
    // empty story table
    emptyPane(storyTable);
    // iterate over the stories and show in table
    for (var story = 0; story < mLength; story++) {
        var row = document.createElement("tr");
        row.style.zIndex = 100;
        row.setAttribute("id", storyList[story].storyId);
        // story number
        var numberCell = document.createElement("td");
        numberCell.innerHTML = (story + 1);
        row.appendChild(numberCell);

        // story label
        var labelCell = document.createElement("td");
        labelCell.setAttribute("class", "left-text");
        labelCell.innerHTML = storyList[story].storyLabel;
        row.appendChild(labelCell);

        // story description
        var descriptionCell = document.createElement("td");
        descriptionCell.setAttribute("class", "left-text");
        descriptionCell.innerHTML = storyList[story].storyDescription;
        row.appendChild(descriptionCell);

        // story type
        var typeCell = document.createElement("td");
        typeCell.setAttribute("class", "center-text");
        var icon = document.createElement("i");
        icon.setAttribute("class", getStoryTypeIconClass(storyList[story].storyType));
        typeCell.appendChild(icon);

        row.appendChild(typeCell);

        // story assignee
        var assigneeCell = document.createElement("td");
        assigneeCell.innerHTML = storyList[story].storyAssignee;
        row.appendChild(assigneeCell);

        // story status
        var statusCell = document.createElement("td");
        var statusText = document.createElement("p");
        if (storyList[story].storyStatus === "Requirements")
            statusText.setAttribute("class", "blue-text");
        else if (storyList[story].storyStatus === "Waiting" || storyList[story].storyStatus === "Paused")
            statusText.setAttribute("class", "red-text");
        else if (storyList[story].storyStatus === "In-progress" || storyList[story].storyStatus === "Done")
            statusText.setAttribute("class", "green-text");

        statusText.innerHTML = storyList[story].storyStatus;
        statusCell.appendChild(statusText);
        row.appendChild(statusCell);

        // story deadline
        var deadlineCell = document.createElement("td");
        var deadlineText = document.createElement("p");
        if (storyList[story].storyDeadline === "flexible")
            deadlineText.setAttribute("class", "green-text");
        else
            deadlineText.setAttribute("class", "red-text");
        deadlineText.innerHTML = storyList[story].storyDeadline;
        deadlineCell.appendChild(deadlineText);
        row.appendChild(deadlineCell);

        storyTable.appendChild(row);
    }
}

/**
 * function returning the icon class based on storyType
 * @param {String} storyType 
 */
function getStoryTypeIconClass(storyType) {
    var typeMap = new Map();
    typeMap.set("Achievement", "fas fa-trophy type-icon");
    typeMap.set("Bug", "fas fa-bug  type-icon");
    typeMap.set("Change request", "fas fa-wrench type-icon");
    typeMap.set("Event", "far fa-calendar-alt type-icon");
    typeMap.set("To-do", "fas fa-list-ol type-icon");

    return typeMap.get(storyType);
}

/**
 * function generating the app id and displaying in appId input box
 */
function generateAppId() {
    // remove the duplicates from the app name
    var name = appName.value.split(" ").join("");
    // make the name as uppercase
    var tempName = name.substring(0, 3).toUpperCase();

    appId.value = tempName + appVersion.value + ((appUpdateType.value === "Technical") ? "TU" : "SU");
}

/**
 * function making an ajax call to add a new version of app
 */
function addNewApp(appName, appVersion, appUpdateType, appId) {
    var xmlHttpRequest = new XMLHttpRequest();
    if (!xmlHttpRequest) {
        alert("Cannot instantiate XMLHttpRequest");
        return false;
    }
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
            if (xmlHttpRequest.status === 200) {
                loadAppsList(JSON.parse(xmlHttpRequest.responseText));
            }
        }
    };
    xmlHttpRequest.open("GET", "http://127.0.0.1:1689/createNewAppVersion?appName=" + appName + "&appVersion=" + appVersion + "&appUpdateType=" + appUpdateType + "&appId=" + appId, true);
    xmlHttpRequest.send();
}

/**
 * function showing all the appsList in leftPane
 */
function showAllAppsList() {
    var xmlHttpRequest = new XMLHttpRequest();
    if (!xmlHttpRequest) {
        alert("Cannot instantiate XMLHttpRequest");
        return false;
    }
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
            if (xmlHttpRequest.status === 200) {
                loadAppsList(JSON.parse(xmlHttpRequest.responseText));
            }
        }
    };
    xmlHttpRequest.open("GET", "http://127.0.0.1:1689/getAllApps", true);
    xmlHttpRequest.send();
}

/**
 * function loading the list in the left pane
 * @param {array} listArray 
 */
function loadAppsList(listArray) {
    // get the reference to left pane
    var leftPane = document.getElementById("leftPane");
    // empty left pane
    emptyPane(leftPane);

    // get the count of apps
    var mLength = listArray.length;

    // iterate over the apps list
    for (var app = 0; app < mLength; app++) {
        var para = document.createElement("p");
        para.setAttribute("class", "app-text");
        // set the id attribute
        para.setAttribute("id", listArray[app].appId);
        // set innerHTML
        para.innerHTML = listArray[app].appName.concat(", ").concat(listArray[app].appVersion);
        //append appName to left pane
        leftPane.appendChild(para);
    }
}

/**
 * function removing the child nodes of left pane
 */
function emptyPane(pane) {
    // iterate and remove the child nodes
    while (pane.firstChild) {
        pane.removeChild(pane.firstChild);
    }
}

function showMessage(message) {
    // show the warning modal
    $("#warningModal").modal("show");
    // display alert text 
    document.getElementById("alertMessage").innerHTML = message;
}

/**
 * function returning the appDetail based on the appId
 * @param {String} selectedAppId, id of the selected app 
 */
function getAppDetail(selectedAppId) {
    var xmlHttpRequest = new XMLHttpRequest();
    if (!xmlHttpRequest) {
        alert("Cannot instantiate XmlHttpRequest");
        return false;
    }

    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
            if (xmlHttpRequest.status === 200) {
                showAppDetail(xmlHttpRequest.responseText);
            }
        }
    };
    xmlHttpRequest.open("GET", "http://127.0.0.1:1689/getAppDetail?appId=" + selectedAppId, true);
    xmlHttpRequest.send();
}

/**
 * function showing the app details
 * @param {object} appObj 
 */
function showAppDetail(appObj) {
    selectedApp = JSON.parse(appObj);
    document.getElementsByClassName("header-container")[0].style.display = "block";
    // show the header
    document.getElementById("header").innerHTML = selectedApp.appName + ", " + selectedApp.appVersion;

    // get the stories for an app
    getAppStories(selectedApp.appId);
}

/**
 * function get the stories based on appId
 * @param {string} appId 
 */
function getAppStories(id) {
    $.ajax({
        url: "http://127.0.0.1:1689/getAppStories",
        data: {
            appId: id
        },
        success: function(result) {
            showStoryList(result);
        }
    });
}