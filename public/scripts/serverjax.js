$(document).ready(function() {

    var newAppButton = document.getElementById("saveNewApp");
    newAppButton.addEventListener("click", function() {
        // hide the modal
        $("#newAppModal").modal('hide');

        var newApp = new NewApp(document.getElementById("appName").value, document.getElementById("appVersion").value, document.getElementById("appUpdateType").value).addNewApp();

    });

    // focus on first input, appName in NewAppModal, when shown
    $("#newAppModal").on("shown.bs.modal", function() {
        $("#appName").trigger("focus");
    });

});

class NewApp {
    constructor(appName, appVersion, updateType) {
        this.appName = appName;
        this.appVersion = appVersion;
        this.updateType = updateType;

        this.identifier = this.createIdentifier();
    }

    /**
     * function removing the duplicates and returning the identifier
     */
    createIdentifier() {
        // remove the duplicates from the app name
        var name = this.appName.split(" ").join("");
        // make the name as uppercase
        var tempName = name.substring(0, 3).toUpperCase();

        return tempName + this.appVersion + this.getUpdateType();
    }

    /**
     * function returning short form technical update (TU) and server update (SU)
     * @returns {string} TU or SU based on update type
     */
    getUpdateType() {
        return (this.updateType === "Technical") ? "TU" : "SU";
    }

    /**
     * function making an ajax call to add a new version of app
     */
    addNewApp() {
        var xmlHttpRequest = new XMLHttpRequest();
        if (!xmlHttpRequest) {
            alert("Cannot instantiate XMLHttpRequest");
            return false;
        }

        xmlHttpRequest.onreadystatechange = function() {
            if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                if (xmlHttpRequest.status === 200) {
                    console.log(xmlHttpRequest.responseText);
                }
            }
        };

        xmlHttpRequest.open("GET", "http://127.0.0.1:1689/createNewAppVersion?appName=" + this.appName + "&appVersion=" + this.appVersion + "&updateType=" + this.updateType, true);
        xmlHttpRequest.send();
    }
}