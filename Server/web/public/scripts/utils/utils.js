const EMAIL_PATTERN = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
const PHONE_PATTERN = "^05\\d-\\d{7}$|^05\\d{8}$";


const timeOutTime = 2000; //2 sec

function validateEmailAddress(email) {
    let reg = new RegExp(EMAIL_PATTERN);
    return reg.test(email);
}

function validatePhone(phone) {
    let reg = new RegExp(PHONE_PATTERN);
    return reg.test(phone);
}


function getCheckedIcon() {
    let res = document.createElement("i");
    res.className += " fa fa-check";
    res.style.color = "green";

    return res;
}

function getUnCheckedIcon() {
    let res = document.createElement("i");
    res.className += " fa fa-times";
    res.style.color = "red";

    return res;
}

function handleErrors() {
    showError("Error", "Action failed due to an unknown reason");
    setTimeout(() => window.location = "/home", timeOutTime)
}


function getPostHeaders() {
    return new Headers({
        'Content-Type': 'application/json'
    });
}

function showErrorsInCreateForm(errorsList, errorListEl) {
    errorListEl.innerHTML = "";
    errorsList.forEach((error) => {
        let domEl = document.createElement("li");
        domEl.textContent = error;
        domEl.style.fontFamily = "Arial";
        errorListEl.appendChild(domEl);
    });
}

const compareTime = (time1, time2) => {
    //return true if time1 > time2
    let time1Minutes = parseInt(time1[0].toString() + time1[1].toString());
    let time1Hours = parseInt(time1[3].toString() + time1[4].toString());

    let time2Minutes =parseInt(time2[0].toString() + time2[1].toString());
    let time2Hours = parseInt(time2[3].toString() + time2[4].toString());

    let t1 = new Date();
    t1.setHours(time1Hours);
    t1.setMinutes(time1Minutes);

    let t2 = new Date();
    t2.setHours(time2Hours);
    t2.setMinutes(time2Minutes);

    return t1.getTime() >= t2.getTime();
};

