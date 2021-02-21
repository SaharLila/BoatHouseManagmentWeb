function getRankFromInt(num) {
    switch (num) {
        case 0:
            return "Beginner";
        case 1:
            return "Average";
        case 2:
            return "Professional";
    }

    return "None";
}

function getBoatTypeFromNum(num) {
    let types = [
        "Single",
        "Due (2X)",
        "Due with coxwain (2X+)",
        "Due Single oar (2-)",
        "Due Single oar with coxwain (2+)",
        "Four (4X)",
        "Four with coxwain (4X+)",
        "Four single oar (4-)",
        "Four single oar with coxwain (4+)",
        "Eight (8X+)",
        "Eight single oar (8+)",
    ];

    return num >= 0 ? types[num] : "None";
}


function buildRowerOptionEl(rower, selected) {
    let res = document.createElement("option");
    res.innerText = getRowerStringFormat(rower);
    res.value = rower.serialNumber;

    if (selected !== undefined && selected) {
        res.setAttribute("selected", "selected");
    }

    return res;
}

function buildBoatOptionEl(boat, selected) {
    let res = document.createElement("option");
    res.className = boat.serialNumber;
    res.innerText = boat.name + ' (' + boat.code + ')';
    res.value = boat.serialNumber;

    if (selected) {
        res.setAttribute('selected', 'selected');
    }

    return res;
}

function buildBoatTypeOptionEl(type) {
    let res = document.createElement("option");
    res.innerText = type.name;
    res.value = type.index;

    if (type.select) {
        res.selected = true;
    }
    return res;
}

function buildWeeklyActivityOptionEl(weeklyActivity, select) {
    let res = document.createElement("option");
    res.innerText = weeklyActivity.name + ' | (' + weeklyActivity.startTime + ' - ' + weeklyActivity.endTime + ')';
    res.value = weeklyActivity.id;

    if (select === undefined) {
        res.selected = false;
    }

    return res;
}


function getBoatsFromServer(filter) {
    return fetch("/collectors/boats", {
        method: 'get'
    }).then(async function (response) {
        let resAsJson = await response.json();
        let boats = resAsJson.boats;

        if (filter !== undefined) {
            boats = boats.filter(boat => filter(boat));
        }

        return boats;
    });
}


function getRowersFromServer(filter) {
    return fetch("/collectors/rowers", {
        method: 'get'
    }).then(async function (response) {
        let rowers = await response.json();

        if (filter !== undefined) {
            rowers.rowers = rowers.rowers.filter(rower => filter(rower));
        }

        return rowers.rowers;
    });
}

function getWeeklyActivitiesFromServer() {
    return fetch("/collectors/weekly-activities", {
        method: 'get'
    }).then(async function (response) {
        let activities = await response.json();

        return activities.activities;
    });
}


function getSimilarTypesFromServer(serialNumber) {
    let data = JSON.stringify({
        serialNumber: serialNumber
    });
    return fetch("/collectors/SimilarBoatTypes", {
        body: data,
        method: 'post',
        headers: getPostHeaders()
    }).then(async function (response) {
        let types = await response.json();

        return types;
    });
}

function getLoggedInUser() {
    return fetch("/collectors/loggedInUser", {
        method: 'get',
        headers: getPostHeaders(),
    }).then(async function (response) {
        let resAsJson = await response.json();

        return resAsJson.isSuccess ? resAsJson.data : undefined;
    });
}

function getRequestsFromServer(id) {
    let req;
    return fetch("/collectors/requests", {
        method: 'get',
        headers: getPostHeaders(),
    }).then(async function (response) {
        let resAsJson = await response.json();

        if (id === undefined) {
            return resAsJson.requests;
        } else {
            resAsJson.requests.forEach(function (request) {
                if (request.id === id) {
                    req = request;
                }
            });

            return req;
        }
    });
}

function getAvailableRowersToMerge(reqId, boatSerialNumber) {
    let data = JSON.stringify({
        reqId: reqId,
        boatSerialNumber: boatSerialNumber
    });

    return fetch("/collectors/requests/mergeable", {
        body: data,
        method: 'post',
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        if (resAsJson.isSuccess) {
            return resAsJson.data.pairs;
        } else {
            showError(resAsJson.data);
        }
    });
}

function duplicateRequestInServer(requestId) {
    let data = JSON.stringify({
        reqId: requestId
    });

    return fetch("/requests/duplicate", {
        body: data,
        method: 'post',
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();


        return resAsJson.isSuccess ? resAsJson.data : undefined;
    });
}


function getRowingActivitiesFromServer() {
    return fetch("/collectors/rowing-activities", {
        method: 'get'
    }).then(async function (response) {
        let resAsJson = await response.json();

        return resAsJson.activities;
    });
}

function reqIsPrevWeekFilter(req) {
    let reqDate = getDateObjectFromString(req.trainingDate);
    let lastWeek = new Date(Date.now());

    minusDaysToDate(lastWeek, 7);

    return reqDate <= Date.now() && reqDate >= lastWeek;
}

function reqIsNextWeekFilter(req) {
    let reqDate = getDateObjectFromString(req.trainingDate);

    let nextWeek = new Date(Date.now());
    addDaysToDate(nextWeek, 7);

    return reqDate >= Date.now() && reqDate <= nextWeek;
}

function specificDayFilter(req) {
    if (bySpecificDayEl.val() !== "") {
        return req.trainingDate === bySpecificDayEl.val();
    } else {
        return true;
    }
}

function initReqInfoDetails(request, infoEl){
    let mainRowerEl = infoEl.querySelector("#mainRower");
    let activityDateEl = infoEl.querySelector("#activityDate");
    let weeklyActivityDetailsEl = infoEl.querySelector("#activityDetails");
    let otherRowersEl = infoEl.querySelector("#otherRowers");
    let boatTypesEl = infoEl.querySelector("#boatTypes");

    mainRowerEl.value = getRowerStringFormat(request.mainRower);
    activityDateEl.value = request.trainingDate;
    weeklyActivityDetailsEl.value = getWeeklyActivityInfoString(request.weeklyActivity);
    initOtherRowersList(request.otherRowersList, otherRowersEl);
    initBoatTypes(request.boatTypesList, boatTypesEl);
}

function getWeeklyActivityInfoString(weeklyActivity) {
    return "Name: " + weeklyActivity.name + "\n" +
        "Start Time: " + weeklyActivity.startTime + "\n" +
        "End Time: " + weeklyActivity.endTime + "\n" +
        "Boat Type Description: " + weeklyActivity.boatTypeDescription + "\n";
}

function initOtherRowersList(otherRowers, otherRowersEl) {
    otherRowersEl.value = "";

    if (otherRowers === undefined || otherRowers.length === 0) {
        otherRowersEl.value = "There aren't any other rowers in this request.";
    } else {
        otherRowers.forEach(function (rower) {
            otherRowersEl.value += getRowerStringFormat(rower) + "\n";
        });
    }
}

function initBoatTypes(boatTypes, boatTypesEl) {
    boatTypesEl.value = "";

    if (boatTypes === undefined || boatTypes.length === 0) {
        boatTypesEl.value = "There aren't any other rowers in this request.";
    } else {
        boatTypes.forEach(function (type) {
            boatTypesEl.value += getBoatTypeFromNum(type) + "\n";
        });
    }
}

