const selectBoatTab = document.getElementById('selectBoatTab');
const addRowersTab = document.getElementById('addRowersTab');
const removeRowersTab = document.getElementById('removeRowersTab');
const infoTab = document.getElementById('infoTab');
const nextStepBtn = document.getElementById('nextStepBtn');
const backStepBtn = document.getElementById('backStepBtn');
const progressBar = document.getElementById('progressBar');
const errors = document.getElementById('errors');

// step 0 elements
const boatListStepOne = document.getElementById('boatSelection');

//step 1 elements
const requestRowersSelectEl = document.getElementById("requestRowersSelect");
const deletedRowersSelectEl = document.getElementById("deleteRowersSelect");
const deleteRowerBtn = document.getElementById("deleteFromRequestBtn");
const addToRequestBtn = document.getElementById("addToRequestBtn");
const howManyLeftToRemoveTextEl = document.getElementById("howManyLeftText");
const errorsLevelOneEl = document.getElementById("errorsLevelOne");

//step 2
const availableRowersSelectEl = document.getElementById("availableRowersSelect");
const newRowersSelectEl = document.getElementById("newRowersSelect");
const joinRowerToRequestBtn = document.getElementById("joinRowerToRequestBtn");
const moveRowerBackBtn = document.getElementById("moveRowerBackBtn");
const howManyToAddTextEl = document.getElementById("howManyToAddText");
const errorsLevelTwoEl = errorsLevelOneEl;

// let id = document.getElementById("requestId").value;
let id = "d7b6e285-b342-4314-b503-5e6a568db350";
let currentStep = 0;
let relevantBoats;
let theBoat;
let howManyLeft;

document.addEventListener("DOMContentLoaded", function () {
    //TODO delete
    handleElementsByStep();
})


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
        if (!resAsJson.isSuccess) {
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
        result = validateStepOne(errorsLevelOneEl);
        if (result) {
            await approveAfterStepTwo();
        }
    } else {

    }

    return result;
}

function validateStepOne(errors) {
    let result = false;

    if (howManyLeft === 0) {
        result = true;
    } else {
        showErrorsInUnOrderedListEl(["Rowers count must be " + theBoat.maxNumberOfRowers], errors);
        setTimeout(function () {
            errorsLevelOneEl.innerHTML = "";
        }, timeOutTime);
    }

    return result;
}

function close() {
    alert("exit function")
    //TODO
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
    getAvailableRowersToMerge(id, theBoat.serialNumber).then(function (rowersReqIdMap){
        alert(JSON.stringify(rowersReqIdMap[0].rower));
    });
}


function handleMergeOtherRequest() {
    initRowersToAdd();
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
        // finish

    } else {

    }

    changeTabs();
}

function findMiddleStep() {
    checkRowersCountStatus().then(function (result) {
        if (result === 0) {
            currentStep = 3;
        } else if (result > 0) {
            currentStep = 1;
        } else {
            currentStep = 2;
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
        nextStepBtn.innerText = "close";
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