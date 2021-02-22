const tableContainer = document.getElementById("tableContainer");
const filterEl = document.getElementById("filter");


let loggedInUser;
let bySpecificDayEl;
let activitiesList;
let currentTimeFilter;

let currentSpecificDay = "";


document.addEventListener("DOMContentLoaded", function () {
    getLoggedInUser().then(function (user) {
        loggedInUser = user;
        createTable(undefined);
        filterEl.addEventListener("change", filterElSelectionChangeEventHandler);
        bySpecificDayEl = $("#bySpecificDay");
        bySpecificDayEl.on('change', applySpecificDayFilter);
    });
});

function applySpecificDayFilter() {
    if (bySpecificDayEl.val() !== currentSpecificDay) {
        currentSpecificDay = bySpecificDayEl.val();
        tableContainer.innerHTML = "";
        createTable(activitySpecificDayFilter);
    }
}

function activitySpecificDayFilter(activity) {
    return specificDayFilter(activity.request);
}

function filterElSelectionChangeEventHandler() {
    if (filterEl.selectedIndex !== 3) {
        document.getElementById('specificDayFilterContainer').style.display = "none";
        let filterToInvoke = getFilterFromSelectedIndex(filterEl.selectedIndex);
        tableContainer.innerHTML = "";

        createTable(filterToInvoke);
    } else {
        document.getElementById('specificDayFilterContainer').style.display = "block";
    }
}

function activityIsNextWeekFilter(activity) {
    return reqIsNextWeekFilter(activity.request);
}

function activityIsPrevWeekFilter(activity) {
    return reqIsPrevWeekFilter(activity.request);
}

function getFilterFromSelectedIndex(selectedIndex) {
    switch (selectedIndex) {
        case 1:
            return activityIsNextWeekFilter;
        case 2:
            return activityIsPrevWeekFilter;
    }

    return undefined;
}


function buildActivityTableRow(activity) {
    let res = [];
    let req = activity.request;
    res.push(document.createTextNode(req.trainingDate));
    res.push(document.createTextNode(req.requestCreator.name));
    res.push(document.createTextNode(req.mainRower.name));
    res.push(document.createTextNode(req.weeklyActivity.startTime));
    res.push(document.createTextNode(req.weeklyActivity.endTime));
    res.push(document.createTextNode(activity.boat.name));

    return res;
}

async function createTable(timeFilterToInvoke) {
    import ("/public/scripts/utils/tables.js").then((tables) => {
        currentTimeFilter = timeFilterToInvoke;

        getRowingActivitiesFromServer().then(activities => {


            activitiesList = timeFilterToInvoke === undefined ? activities : activities.filter(timeFilterToInvoke);
            if (activitiesList.length !== 0) {
                let names = ["Activity Date", "Creator", "Main Rower", "Start Time", "End Time", "Boat Name"];
                let table = tables.createEmptyTable(names);
                tableContainer.appendChild(table);
                let i = 1;
                activitiesList.forEach((activity) => {
                    let activityTableRow = buildActivityTableRow(activity);
                    let activityRow = tables.buildTableRow(activity.id, activityTableRow, i++, onDelete, onEdit, onInfo);
                    activityRow.querySelector(".btn-secondary").parentNode.remove();
                    activityRow.querySelector(".btn-danger").parentNode.classList.remove("col-md-4");
                    activityRow.querySelector(".btn-danger").parentNode.classList.add("col-md-6");
                    table.querySelector("#tableBody")
                        .appendChild(activityRow);
                });
                tables.applyDataTable();
            } else {
                tableContainer.appendChild(tables.getNoDataEl());
            }
        }).catch(() => handleErrors());
    });
}

async function deleteActivity(activity) {
    let data = JSON.stringify({
        activityId: activity.id
    });

    if (await showAreYouSureMessage("Are you sure that you want to delete this request?")) {
        await fetch('/rowing-activities/delete', {
            method: 'post',
            body: data,
            headers: getPostHeaders()
        }).then(async function (response) {
            let resAsJson = await response.json();
            if (resAsJson.isSuccess) {
                showSuccess("Rowing activity successfully removed!");
            } else {
                showError("Rowing activity removed failed!");
            }

            setTimeout(function () {
                window.location.reload();
            }, timeOutTime);
        });
    }
}

async function onDelete(id) {
    const activity = activitiesList.filter(activity => activity.id === id)[0];

    deleteActivity(activity);
}

function onEdit() {
    // no implement needed
}

function onInfo(id) {
    const activity = activitiesList.filter(activity => activity.id === id)[0];
    createInfoPage(activity).then(infoPageEl => {
        showInfoPopup(infoPageEl);
    });
}


function createInfoPage(activity) {
    return import ("/public/scripts/views/rowing-activity/info.js").then((info) => {
        let infoEl = info.getInfoDiv();
        initReqInfoDetails(activity.request, infoEl);
        initBoatInfo(activity.boat, infoEl);

        return infoEl;
    });
}
