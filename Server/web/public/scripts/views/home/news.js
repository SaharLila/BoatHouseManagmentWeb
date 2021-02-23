const generalMessagesCard = document.getElementById("generalMessagesCard");
const newsContainer = document.getElementById("newsContainer");
const addItemBtn = document.getElementById("addItemBtn");

let loggedInUserIsAdmin;

document.addEventListener("DOMContentLoaded", function () {
    initNews().then(items => {
        getLoggedInUser().then(loggedInUser => {
            loggedInUserIsAdmin = loggedInUser.isAdmin;

            if (items.length !== 0) {
                buildNewsCard(items);
            } else {
                generalMessagesCard.querySelector("#newsContainer")
                    .appendChild(getNoDataElement());
            }

            if (loggedInUserIsAdmin) {
                addItemBtn.addEventListener("click", addItemBtnClickEventHandler);
            } else {
                addItemBtn.parentNode.remove();
            }
        });
    });
});

function buildNewsCard(items) {
    items.forEach(item => {
        let rowEl = addRowToNews();
        let paragraphEl = rowEl.querySelector("p")
        paragraphEl.innerText = item.content;
        rowEl.itemId = item.id;
    });

    initDeleteBtns();
    initEditBtns();
}

function initNews() {
    return fetch("/news/get", {
        method: 'get'
    }).then(async function (response) {
        let resAsJson = await response.json();
        let items = resAsJson.items;

        return items;
    });
}

function addRowToNews() {
    let noDataEl = newsContainer.querySelector("h4");

    if (noDataEl !== null) {
        noDataEl.parentElement.remove();
    }

    let res = getRowHtml();

    if (!loggedInUserIsAdmin) {
        res.querySelector("button").parentElement.parentElement.remove();
    }

    newsContainer.appendChild(res);
    newsContainer.appendChild(document.createElement("hr"));

    return res;
}

function addItemBtnClickEventHandler(e) {
    let theRow = addRowToNews();
    let editBtn = theRow.querySelector(".btn-messageEdit");
    editBtn.addEventListener("click", editBtnClickEventHandler);
    theRow.querySelector(".btn-danger").addEventListener("click", deleteBtnClickEventHandle);
    editBtn.click();
    theRow.querySelector("input").focus();
}

function deleteBtnClickEventHandle(e) {
    let rowEl = this.parentElement.parentElement.parentElement.parentElement;

    if (rowEl.itemId != undefined) {
        let data = JSON.stringify({
            itemToDeleteId: rowEl.itemId.toString()
        });

        return fetch("/news/delete", {
            method: 'post',
            body: data,
            headers: getPostHeaders()
        }).then(async function (response) {
            let resAsJson = await response.json();

            if (resAsJson.isSuccess) {
                await removeRowFromNewsContainer(rowEl);
            }
        });
    } else {
        removeRowFromNewsContainer(rowEl);
    }
}

function removeRowFromNewsContainer(rowEl) {
    rowEl.nextSibling.remove(); // remove the <hr> element
    rowEl.remove();
    if (newsContainer.innerHTML.trim() === "") {
        newsContainer.appendChild(getNoDataElement());
    }
}

function initDeleteBtns() {
    generalMessagesCard.querySelectorAll(".btn-danger").forEach(deleteBtn => {
        deleteBtn.addEventListener("click", deleteBtnClickEventHandle)
    });
}

function makeEnableToEdit(editBtn) {
    let rowEl = editBtn.parentElement.parentElement.parentElement.parentElement;
    let paragraphEl = rowEl.querySelector("p");
    let stringToEdit = paragraphEl.innerHTML;
    let placeToInsert = paragraphEl.parentElement;
    paragraphEl.remove();

    placeToInsert.appendChild(getInputEl(stringToEdit));
}

function changeIcons(editBtn) {
    let icon = editBtn.querySelector("i");
    icon.innerText = editBtn.isEditOn ? "check" : "edit";
}

function addNewsItem(content) {
    let data = JSON.stringify({
        content: content
    });

    return fetch("/news/add", {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    }).then(async function (response) {
        let resAsJson = await response.json();
        let newItemId;

        if (resAsJson.isSuccess) {
            newItemId = await resAsJson.data;
        }

        return newItemId;
    });
}

function updateNewsItem(itemId, content) {
    let data = JSON.stringify({
        newContent: content,
        itemId: itemId.toString()
    });

    fetch("/news/update", {
        method: 'post',
        body: data,
        headers: getPostHeaders()
    });
}

function saveEditMessage(rowEl, content) {
    if (rowEl.itemId !== undefined) {
        updateNewsItem(rowEl.itemId, content)
    } else {
        addNewsItem(content).then(newItemId => {
            rowEl.itemId = newItemId;
        });
    }
}

function makeDisableToEdit(editBtn) {
    let rowEl = editBtn.parentElement.parentElement.parentElement.parentElement;
    let inputEl = rowEl.querySelector("input");

    if (inputEl.value !== "" && inputEl.value !== undefined) {
        let string = inputEl.value;
        let placeToInsert = inputEl.parentElement;
        inputEl.remove();
        let paragraphElement = document.createElement("p");
        paragraphElement.innerText = string;

        placeToInsert.appendChild(paragraphElement);
        editBtn.isEditOn = false;
        saveEditMessage(rowEl, string);
        changeIcons(editBtn);
    } else {
        showError("News could not be empty");

    }
}

function editBtnClickEventHandler(e) {
    if (!this.isEditOn) {
        makeEnableToEdit(this);
        this.isEditOn = true;
        changeIcons(this);
    } else {
        makeDisableToEdit(this);
    }
}

function getInputEl(stringToInsert) {
    let res = document.createElement("input");
    res.classList.add("form-control");
    res.value = stringToInsert.trim();

    return res;
}

function initEditBtns() {
    generalMessagesCard.querySelectorAll(".btn-messageEdit").forEach(editBtn => {
        editBtn.isEditOn = false;
        editBtn.addEventListener("click", editBtnClickEventHandler);
    });
}


function getRowHtml() {
    let res = document.createElement("div");
    res.classList.add("row");
    res.innerHTML = "<div class=\"col-10\">\n" +
        "                                                <p>\n" +
        "                                                </p>\n" +
        "                                            </div>\n" +
        "                                            <div class=\"col-2\">\n" +
        "                                                <div class=\"row\">\n" +
        "                                                    <div class=\"col-6\">\n" +
        "                                                        <button type=\"button\"\n" +
        "                                                                class=\"btn btn-messageEdit btn-link newsBtnLeft\">\n" +
        "                                                            <i class=\"material-icons\">edit</i>\n" +
        "                                                        </button>\n" +
        "                                                    </div>\n" +
        "                                                    <div class=\"col-6\">\n" +
        "                                                        <button type=\"button\"\n" +
        "                                                                class=\"btn btn-danger btn-link newsBtnRight\"\n" +
        "                                                                data-original-title=\"Remove\">\n" +
        "                                                            <i class=\"material-icons\">close</i>\n" +
        "                                                        </button>\n" +
        "                                                    </div>\n" +
        "                                                </div>\n" +
        "                                            </div>";

    return res;
}

function getNoDataElement() {
    let header = document.createElement("h4");
    let div = document.createElement("div");
    header.innerText = "There is no news so far";
    header.style.marginTop = "50px";
    div.classList.add("col-12");
    div.style.textAlign = "center";
    div.appendChild(header);

    return div;
}