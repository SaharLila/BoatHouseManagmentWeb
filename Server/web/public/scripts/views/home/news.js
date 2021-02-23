const generalMessagesCard = document.getElementById("generalMessagesCard");

document.addEventListener("DOMContentLoaded", function () {
    initDeleteBtns();
    initEditBtns();
});


function deleteBtnClickEventHandle(e) {
    alert("delete");
    //update in server and refresh
}

function initDeleteBtns() {
    generalMessagesCard.querySelectorAll(".btn-danger").forEach(deleteBtn => {
        deleteBtn.addEventListener("click", deleteBtnClickEventHandle)
    });
}

function makeEnableToEdit(editBtn) {
    let tableRowEl = editBtn.parentElement.parentElement;
    let paragraphEl = tableRowEl.querySelector("p");
    let stringToEdit = paragraphEl.innerHTML;
    let placeToInsert = paragraphEl.parentElement;
    paragraphEl.remove();

    placeToInsert.appendChild(getInputEl(stringToEdit));
}

function changeIcons(editBtn) {
    let icon = editBtn.querySelector("i");
    icon.innerText = editBtn.isEditOn ? "check" : "edit";
}

function saveEditMessage() {
    alert("save");
}

function makeDisableToEdit(editBtn) {
    let tableRowEl = editBtn.parentElement.parentElement;
    let inputEl = tableRowEl.querySelector("input");
    let string = inputEl.value;
    let placeToInsert = inputEl.parentElement;
    inputEl.remove();
    let paragraphElement = document.createElement("p");
    paragraphElement.classList.add("form-control");
    paragraphElement.innerText = string;

    placeToInsert.appendChild(paragraphElement);
}

function editBtnClickEventHandler(e) {

    alert(this.isEditOn);

    if (!this.isEditOn) {
        makeEnableToEdit(this);
        this.isEditOn = true;
        changeIcons(this);
    } else {
        makeDisableToEdit(this);
        saveEditMessage();
        this.isEditOn = false;
        changeIcons(this);
    }
}

function getInputEl(stringToInsert) {
    let res = document.createElement("input");
    res.classList.add("form-control");
    res.value = stringToInsert.trim();
    alert(stringToInsert);

    return res;
}

function initEditBtns() {
    generalMessagesCard.querySelectorAll(".btn-messageEdit").forEach(editBtn => {
        editBtn.isEditOn = false;
        editBtn.addEventListener("click", editBtnClickEventHandler);
    });
}