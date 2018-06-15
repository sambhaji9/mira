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
        var appDetails = getAppDetail(selectedAppId);
    });
});

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

var selectedApp = {};

/**
 * function showing the app details
 * @param {object} appObj 
 */
function showAppDetail(appObj) {
    selectedApp = appObj;
    console.log(selectedApp);
}