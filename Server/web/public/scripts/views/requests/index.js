document.addEventListener("DOMContentLoaded", function () {
    createTable();
});

const tableContainer = document.getElementById("tableContainer");
let requestsList;


function buildRequestTableRow(req) {
    let res = [];
    res.push(document.createTextNode(req.creationDate));
    res.push(document.createTextNode(req.trainingDate));
    res.push(document.createTextNode(req.requestCreator.name));
    res.push(document.createTextNode(req.weeklyActivity.startTime));
    res.push(document.createTextNode(req.weeklyActivity.endTime));
    res.push(!req.isApproved ? getUnCheckedIcon() : getCheckedIcon());

    return res;
}

async function createTable() {
    import ("/public/scripts/utils/tables.js").then((tables) => {
        getRequestsFromServer().then(requests => {
            if (requests.length !== 0) {
                requestsList = requests;
                let names = ["Creation Date", "Activity Date", "Creator", "Start Time", "End Time", "Is Approved"];
                let table = tables.createEmptyTable(names);
                tableContainer.appendChild(table);
                let i = 1;
                requests.forEach((req) => {
                    let requestsTableRow = buildRequestTableRow(req);
                    table.querySelector("#tableBody")
                        .appendChild(tables.getRowInTable(req.id, requestsTableRow, i++, onDelete, onEdit, onInfo));
                });
            } else {
                tableContainer.appendChild(tables.getNoDataEl());
            }
        }).catch(() => handleErrors());
    });
}

function onDelete(id) {
    const request = requestsList.filter(req => req.id === id)[0];
    if (request.isApproved) {
        showError("You can't to delete an approved request");
    } else {
        deleteRequest(request);
    }
}

async function deleteRequest(request) {
    let data = JSON.stringify({
        reqId: request.id
    });

    if (await showAreYouSureMessage("Are you sure that you want to delete this request?")) {

        await fetch('/requests/delete', {
            method: 'post',
            body: data,
            headers: getPostHeaders()
        }).then(async function (response) {
            let resAsJson = await response.json();
            if (resAsJson.isSuccess) {
                showSuccess("Request successfully removed!");
            } else {
                showError("Request removed failed!");
            }

            setTimeout(function () {
                window.location.reload();
            }, timeOutTime);
        });
    }
}

function onEdit(id) {
    let data = JSON.stringify({
        id: id,
    });

    fetch('/requests/update/init', {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        if (resAsJson.isSuccess) {
            window.location = "/requests/update";
        } else {
            showError(resAsJson.error);
        }
    });
}

function onInfo(id) {
    const request = requestsList.filter(req => req.id === id)[0];
    createInfoPage(request).then(infoPageEl => {
        showInfoPopup(infoPageEl);
    });
}


function createInfoPage(request) {
    return import ("/public/scripts/views/requests/info.js").then((info) => {
        let infoEl = info.getInfoDiv();
        let mainRowerEl = infoEl.querySelector("#mainRower");
        let activityDateEl = infoEl.querySelector("#activityDate");
        let weeklyActivityDetailsEl = infoEl.querySelector("#activityDetails");
        let otherRowersEl = infoEl.querySelector("#otherRowers");


        getLoggedInUser().then(loggedInUser => {
            mainRowerEl.value = getRowerStringFormat(request.mainRower);

            activityDateEl.value = request.trainingDate;
            weeklyActivityDetailsEl.value = getWeeklyActivityInfoString(request.weeklyActivity);
            initOtherRowersList(request.otherRowersList, otherRowersEl);

            let duplicateBtn = infoEl.querySelector("#duplicateBtn");
            if (loggedInUser.isAdmin) {
                duplicateBtn.addEventListener("click", e => handleUpdateClick(e, request))
            } else {
                duplicateBtn.hidden = true;
            }

        });

        return infoEl;
    });
}

function handleUpdateClick(e, request) {
    e.preventDefault();
    duplicateRequestInServer(request.id).then(function (duplicated) {
        if (duplicated !== undefined) {
            showSuccess("Request successfully duplicated!");
        } else {
            showError("Duplicating request has failed.");
        }

        setTimeout(function () {
            window.location.reload();
        }, longTimeOutTime);
    }).catch(handleErrors);
}

function initOtherRowersList(otherRowers, otherRowersEl) {
    if (otherRowers === undefined || otherRowers.length === 0) {
        otherRowersEl.value = "There aren't any other rowers in this request.";
    } else {
        otherRowers.forEach(function (rower) {
            otherRowers.value += getRowerStringFormat(rower) + "\n";
        });
    }
}

function getWeeklyActivityInfoString(weeklyActivity) {
    return "Name: " + weeklyActivity.name + "\n" +
        "Start Time: " + weeklyActivity.startTime + "\n" +
        "End Time: " + weeklyActivity.endTime + "\n" +
        "Boat Type Description: " + weeklyActivity.boatTypeDescription + "\n";

}
