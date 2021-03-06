const selectBoatTab = document.getElementById('selectBoatTab');
const addRowersTab = document.getElementById('addRowersTab');
const removeRowersTab = document.getElementById('removeRowersTab');
const infoTab = document.getElementById('infoTab');
const nextStepBtn = document.getElementById('nextStepBtn');
const backStepBtn = document.getElementById('backStepBtn');
const progressBar = document.getElementById('progressBar');

const errors = document.getElementById('errors');
const errorsMiddleStepEl = document.getElementById("errorsLevelOne");

// step 0 elements
const boatListStepOne = document.getElementById('boatSelection');

//step 1 elements
const requestRowersSelectEl = document.getElementById("requestRowersSelect");
const deletedRowersSelectEl = document.getElementById("deleteRowersSelect");
const deleteRowerBtn = document.getElementById("deleteFromRequestBtn");
const addToRequestBtn = document.getElementById("addToRequestBtn");
const howManyLeftToRemoveTextEl = document.getElementById("howManyLeftText");

//step 2
const availableRowersSelectEl = document.getElementById("availableRowersSelect");
const newRowersSelectEl = document.getElementById("newRowersSelect");
const joinRowerToRequestBtn = document.getElementById("joinRowerToRequestBtn");
const moveRowerBackBtn = document.getElementById("moveRowerBackBtn");
const howManyToAddTextEl = document.getElementById("howManyToAddText");

let id = document.getElementById("requestId").value;

let currentStep = 0;
let boatsList;
let theBoat;
let howManyLeft = 0;
let rowingActivity;

export function startToApprove() {
    handleElementsByStep();
}

// Tabs functionality
nextStepBtn.addEventListener('click', function () {
    validateCurrentStep().then(function (result) {
        if (result) {
            changeStep();
        }
    });
})

async function changeStep() {
    if (currentStep === 0) {
        findMiddleStep();
    } else {
        currentStep = 3;
        handleElementsByStep();
    }

}

backStepBtn.addEventListener('click', function () {
    if (currentStep > 0) {
        currentStep = 0;
        handleElementsByStep();
    } else {
        close();
    }
})

async function approveAfterStepTwo() {
    let deletedRowers = [];

    deletedRowersSelectEl.childNodes.forEach(function (optionEl) {
        deletedRowers.push(optionEl.value);
    });

    let data = JSON.stringify({
        reqId: id,
        boatSerialNumber: theBoat.serialNumber,
        deletedRowers: JSON.stringify(deletedRowers)
    });

    await fetch("/rowing-activities/approveOverflowRequest", {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        if (resAsJson.isSuccess) {
            rowingActivity = resAsJson.data;
        } else {
            showError("Request couldn't be approved due to unknown problem");
            close();
        }
    });
}

async function approveAfterStepThree() {
    let newRowers = [];

    newRowersSelectEl.childNodes.forEach(function (optionEl) {
        newRowers.push(optionEl.value);
    });

    let data = JSON.stringify({
        reqId: id,
        boatSerialNumber: theBoat.serialNumber,
        rowersReqIdList: JSON.stringify(newRowers)
    });


    await fetch("/rowing-activities/approveMergedRequest", {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        if (resAsJson.isSuccess) {
            rowingActivity = resAsJson.data;
        } else {
            showError("Request couldn't be approved due to unknown problem");
            close();
        }
    });
}

async function validateCurrentStep() {
    let result = false;
    if (currentStep === 0) {
        let selectedBoatId = document.getElementById('boatSelection').value;
        theBoat = boatsList.filter(boat => boat.serialNumber === selectedBoatId)[0];

        if (selectedBoatId === "") {
            showErrorsInUnOrderedListEl(["You must select a boat to move next."], errors)
            setTimeout(function () {
                errors.innerHTML = "";
            }, longTimeOutTime);
        } else {
            await removeUnavailableRowers().then(function (isSuccess) {
                if (isSuccess) {
                    result = true;
                }
            });
        }
    } else if (currentStep === 1) {
        result = validateMiddleStep(errorsMiddleStepEl);
        if (result) {
            await approveAfterStepTwo();
        }
    } else if (currentStep === 2) {
        result = validateMiddleStep(errorsMiddleStepEl);
        if (result) {
            await approveAfterStepThree();
        }

    }

    return result;
}

function validateMiddleStep(errors) {
    let result = false;

    if (howManyLeft === 0) {
        result = true;
    } else {
        showErrorsInUnOrderedListEl(["Rowers count must be " + theBoat.maxNumberOfRowers], errors);
        setTimeout(function () {
            errorsMiddleStepEl.innerHTML = "";
        }, timeOutTime);
    }

    return result;
}

function close() {
    location.reload();
}

function initSelectList(rowers) {
    requestRowersSelectEl.innerHTML = "";
    deletedRowersSelectEl.innerHTML = "";
    rowers.forEach(function (rower) {
        requestRowersSelectEl.appendChild(buildRowerOptionEl(rower, false));
    });
}

function changeHowManyLeft() {
    howManyLeftToRemoveTextEl.innerText = "YOU HAVE TO REMOVE " + howManyLeft + " MORE ROWERS";
    if (howManyLeft === 0) {
        deleteRowerBtn.disabled = true;
        deleteRowerBtn.style.cursor = "not-allowed";
        howManyLeftToRemoveTextEl.style.color = "green";
    } else {
        deleteRowerBtn.disabled = false;
        deleteRowerBtn.style.cursor = "default";
        howManyLeftToRemoveTextEl.style.color = "red";
    }
}

addToRequestBtn.addEventListener("click", function () {
    let selectedItem = deletedRowersSelectEl[deletedRowersSelectEl.selectedIndex];
    if (selectedItem !== undefined) {
        requestRowersSelectEl.appendChild(selectedItem);
        selectFirstOption();
        howManyLeft++;
        changeHowManyLeft();
    }
});

deleteRowerBtn.addEventListener("click", function () {
    if (howManyLeft > 0) {
        let selectedItem = requestRowersSelectEl[requestRowersSelectEl.selectedIndex];
        if (selectedItem !== undefined) {
            deletedRowersSelectEl.appendChild(selectedItem);
            selectFirstOption();
            howManyLeft--;
            changeHowManyLeft();
        }
    }
});

function selectFirstOption() {
    if (requestRowersSelectEl[0] !== undefined) {
        requestRowersSelectEl[0].selected = true;
    }
    if (deletedRowersSelectEl[0] !== undefined) {
        deletedRowersSelectEl[0].selected = true;
    }

    if (availableRowersSelectEl[0] !== undefined) {
        availableRowersSelectEl[0].selected = true;
    }

    if (newRowersSelectEl[0] !== undefined) {
        newRowersSelectEl[0].selected = true;
    }
}

function handleTooManyRowers() {
    getRequestsFromServer(id).then(function (request) {
        howManyLeft = request.otherRowersList.length + 1 - theBoat.maxNumberOfRowers; // '+1' because the main rower
        changeHowManyLeft();
        let rowers = [];
        rowers.push(request.mainRower);
        rowers.push.apply(rowers, request.otherRowersList);
        initSelectList(rowers);
    });
}

function handleStageZero() {
    getBoatsForRequestFromServer(id).then(function (boats) {
        boatsList = boats;
        if (boats.length === 0) {
            showErrorsInUnOrderedListEl(["Couldn't find any boat that can be used for this request"], errors);
        } else {
            boats.forEach(function (boat) {
                boatListStepOne.appendChild(buildBoatOptionEl(boat, false));
            });
        }
    });
}

function initRowersToAdd() {
    availableRowersSelectEl.innerHTML = "";
    newRowersSelectEl.innerHTML = "";
    getAvailableRowersToMerge(id, theBoat.serialNumber).then(function (rowersReqIdList) {
        if (howManyLeft > rowersReqIdList.length) {
            showError("You don't have enough rowers in your request and we couldn't find enough rowers that can join this request.");
            setTimeout(() => location.reload(), veryLongTimeOutTime);
        } else {
            rowersReqIdList.forEach(function (reqIdPair) {
                let optionEl = buildRowerOptionEl(reqIdPair.rower);
                optionEl.value = JSON.stringify({
                    rowerSerialNumber: reqIdPair.rower.serialNumber,
                    reqId: reqIdPair.reqId
                });

                availableRowersSelectEl.appendChild(optionEl);
            });
        }
    });
}

joinRowerToRequestBtn.addEventListener("click", function () {
    if (howManyLeft > 0) {
        let selectedItem = availableRowersSelectEl[availableRowersSelectEl.selectedIndex];
        if (selectedItem !== undefined) {
            newRowersSelectEl.appendChild(selectedItem);
            selectFirstOption();
            howManyLeft--;
            changeHowManyToAdd();
        }
    }
});

moveRowerBackBtn.addEventListener("click", function () {
    let selectedItem = newRowersSelectEl[newRowersSelectEl.selectedIndex];
    if (selectedItem !== undefined) {
        availableRowersSelectEl.appendChild(selectedItem);
        selectFirstOption();
        howManyLeft++;
        changeHowManyToAdd();
    }
});

function changeHowManyToAdd() {
    howManyToAddTextEl.innerText = "YOU HAVE TO ADD " + howManyLeft + " MORE ROWERS";

    if (howManyLeft === 0) {
        joinRowerToRequestBtn.disabled = true;
        joinRowerToRequestBtn.style.cursor = "not-allowed";
        howManyToAddTextEl.style.color = "green";
    } else {
        joinRowerToRequestBtn.disabled = false;
        joinRowerToRequestBtn.style.cursor = "default";
        howManyToAddTextEl.style.color = "red";
    }
}

function handleMergeOtherRequest() {
    getRequestsFromServer(id).then(function (request) {
        initRowersToAdd();
        howManyLeft = theBoat.maxNumberOfRowers - (request.otherRowersList.length + 1);// '+1' because the main rower
        changeHowManyToAdd();
    });
}

function showApprovedRequestInfo() {
    createInfoPage(rowingActivity).then(infoEl => {
        infoTab.appendChild(infoEl);
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

function handleElementsByStep() {
    errors.innerHTML = "";

    if (currentStep === 0) {
        handleStageZero();
    } else if (currentStep === 1) {
        handleTooManyRowers();
    } else if (currentStep === 2) {
        handleMergeOtherRequest();
    } else if (currentStep === 3) {
        showApprovedRequestInfo();
    } else {
        handleErrors();
    }

    changeTabs();
}

function findMiddleStep() {
    checkRowersCountStatus().then(function (result) {
        if (result > 0) {
            currentStep = 1;
        } else if (result < 0) {
            currentStep = 2;
        } else {
            rowingActivity = result;
            currentStep = 3;
        }

        handleElementsByStep();
    });
}

function checkRowersCountStatus() {
    let data = JSON.stringify({
        id: id,
        boatId: boatListStepOne.value
    })

    return fetch("/requests/find-rowers-status", {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        if (resAsJson.isSuccess) {
            return await resAsJson.data;
        } else {
            showError(resAsJson.data);
            setTimeout(function () {
                location.reload();
            }, longTimeOutTime);
        }
    });
}

function removeUnavailableRowers() {
    let data = JSON.stringify({
        id: id
    })

    return fetch("/requests/removeUnavailableRowers", {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        if (resAsJson.isSuccess) {
            return true;
        } else {
            showError("All of the rowers are already taking part in other club activities at the same time frame." +
                " The request has been automatically removed.");
            setTimeout(function () {
                location.reload();
            }, veryLongTimeOutTime);
        }
    });

}

function changeTabs() {
    if (currentStep === 0) {
        selectBoatTab.classList.add("active");
        addRowersTab.classList.remove("active");
        removeRowersTab.classList.remove("active");
        infoTab.classList.remove("active");
        nextStepBtn.disabled = false;
        backStepBtn.disabled = false;
        nextStepBtn.style.cursor = "default"
        progressBar.style.width = "33.33%";
        backStepBtn.innerText = "Close"


    } else if (currentStep === 1) {
        selectBoatTab.classList.remove("active");
        addRowersTab.classList.add("active");
        removeRowersTab.classList.remove("active");
        infoTab.classList.remove("active");
        allowBothButtons();

    } else if (currentStep === 2) {
        selectBoatTab.classList.remove("active");
        addRowersTab.classList.remove("active");
        removeRowersTab.classList.add("active");
        infoTab.classList.remove("active");
        allowBothButtons();

    } else {
        selectBoatTab.classList.remove("active");
        addRowersTab.classList.remove("active");
        removeRowersTab.classList.remove("active");
        infoTab.classList.add("active");
        backStepBtn.remove();
        nextStepBtn.disabled = false;
        nextStepBtn.style.cursor = "default"
        nextStepBtn.innerText = "Finish";

        let btnClone = nextStepBtn.cloneNode(true);
        nextStepBtn.parentNode.replaceChild(btnClone, nextStepBtn);
        btnClone.addEventListener("click", close);
        progressBar.style.width = "100%";
    }
}

function allowBothButtons() {
    backStepBtn.disabled = false;
    nextStepBtn.disabled = false;
    backStepBtn.style.cursor = "default";
    nextStepBtn.style.cursor = "default";
    progressBar.style.width = "66.66%";
    backStepBtn.innerText = "Back";
}

function getBoatsForRequestFromServer(requestId) {
    let data = JSON.stringify({
        id: requestId
    })

    return fetch("/collectors/boats/getRelevantBoatsForRequest", {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        if (resAsJson.isSuccess) {
            return resAsJson.data.boats;
        } else {
            handleErrors();
        }
    });
}