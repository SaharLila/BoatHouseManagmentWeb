const menuItemsListEl = document.getElementById("mainMenu")
const currentYearElements = document.getElementsByClassName("currentYear");
const titleEl = document.getElementById("title");
const notificationsBtn = document.getElementById("notificationsBtn");
const notifications = document.getElementById("notificationDropDown");
const notificationsCounter = document.getElementById("notificationsCounter");
const removeAllNotificationsBtn = document.getElementById('removeAllNtfsLink');
const notificationsRefreshRate = 10 * 1000;

document.addEventListener("DOMContentLoaded", function () {
    getNavMenuItems();
    setCurrentYear();
    initNotifications();
    initJqueryPlugins();
    refreshNotificationsCount();
});


function initJqueryPlugins() {
    $('.datepicker2').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd/mm/yyyy'
    });

    $('.select2El').select2();
}

function setCurrentYear() {
    let year = new Date().getFullYear();
    for (let i = 0; i < currentYearElements.length; i++) {
        currentYearElements.item(i).textContent = year;
    }
}

function buildMenuItem(itemObject) {
    let active = itemObject.isActive ? " active" : "";
    return '<li class = "nav-item' + active + '">' +
        '<a href="' + itemObject.href + '" class="nav-link" id="' + itemObject.id + '">' +
        '   <p class="simple-text">' + '<i class="' + itemObject.iconName + '"></i>' + itemObject.text + '</p>' +
        '</a>' +
        '</li>';
}

function buildMenu(menuItemsList) {
    let html = "";
    menuItemsList.forEach((menuItem) => {
        if (menuItem.isActive) {
            titleEl.innerText = menuItem.text.toUpperCase();
        }

        html += buildMenuItem(menuItem) + "\n"
    });
    menuItemsListEl.innerHTML = html;
}

function getNavMenuItems() {
    fetch("/layout", {
        method: 'get'
    }).then((response) => {
        response.json().then(function (value) {
            buildMenu(value.menu);
        });
    });
}


function initDateTmePicker() {
    $('.timepicker').datetimepicker({
        icons: {
            time: "fa fa-clock-o",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove',
            pick12HourFormat: false
        },
        format: 'LT',
    });
}


// Notifications

// TODO - delete
insertSingleNotification(buildNotificationElement("content", "20/2/2020 20:00", 1, true));
insertSingleNotification(buildNotificationElement("content", "20/2/2020 20:00", 2, false));
insertSingleNotification(buildNotificationElement("content", "20/2/2020 20:00", 3, true));


async function refreshNotificationsCount() {
    setInterval(function () {
        notificationsCounter.innerText = countUnreadNotificationsInServer();
    }, notificationsRefreshRate)
}


function insertSingleNotification(element) {
    notifications.appendChild(element);
}

function toggleNotifications() {
    if (notifications.classList.contains("show")) {
        notifications.classList.remove("show")
    } else {
        getAndInsertNotifications();
        notificationsCounter.innerText = "0";
        notifications.classList.add("show")
    }
}

function toggleNotificationsBody() {
    if (notifications.classList.contains("show")) {
        notifications.classList.remove("show")
    }
}

function initNotifications() {
    notificationsBtn.addEventListener('click', toggleNotifications);
    document.querySelector('.content').addEventListener('click', toggleNotificationsBody);
    document.querySelector('footer').addEventListener('click', toggleNotificationsBody);
    document.querySelector('.sidebar').addEventListener('click', toggleNotificationsBody);
    removeAllNotificationsBtn.addEventListener('click', removeAllNotifications);
}

function getNoNotificationsElement() {
    let html =
        "<div class=\"dropdown-item\">\n" +
        "    <div class=\"row\">\n" +
        "        <div class=\"col-12\">\n" +
        "            <span style=\"margin-right: 25px;\" href=\"#\">\n" +
        "                Couldn't find any notifications\n" +
        "            </span>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";

    let element = document.createElement("span");
    element.innerHTML = html;
    let dropDownItem = element.querySelector('.dropdown-item');
    dropDownItem.style.borderLeft = "3px solid";
    dropDownItem.style.borderLeftColor = "#56baed";
    return element;
}


function buildNotificationElement(text, date, id, unread) {
    let html =
        "<div style=\"border-bottom: 1px ridge; min-width: 250px;\" class=\"dropdown-item\">\n" +
        "    <div class=\"row\">\n" +
        "        <div class=\"col-10\">\n" +
        "            <span style=\"margin-right: 25px;\" href=\"#\">\n" +
        "               " + text +
        "            </span>\n" +
        "            <br>\n" +
        "            <span class=\"notificationDate\">" + date + "</span>\n" +
        "        </div>\n" +
        "        <div class=\"col-2\">\n" +
        "            <i class=\"material-icons removeNotificationIcon\">delete_outline</i>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "    <hr>" +
        "</div>";

    let element = document.createElement("span");
    element.innerHTML = html;
    element.id = "ntfs" + id;
    let dropDownItem = element.querySelector('.dropdown-item');

    if (unread) {
        element.querySelectorAll('span').forEach(el => el.style.fontWeight = "bold");
        dropDownItem.style.borderLeft = "3px solid";
        dropDownItem.style.borderLeftColor = "#56baed";
        markAsReadOnServer(id);
    } else {
        dropDownItem.style.borderLeft = "3px solid";
        dropDownItem.style.borderLeftColor = "transparent";
    }

    element.querySelector('.removeNotificationIcon').addEventListener('click', function (e) {
        removeNotificationNode(id);
    })

    return element;
}

function removeNotificationNode(id) {
    document.getElementById('ntfs' + id).remove();
    if (notifications.childNodes.length === 3) {
        insertSingleNotification(getNoNotificationsElement());
    }
}

function removeAllNotificationsNodes(idArr) {
    if (idArr.length > 0) {
        idArr.forEach(id => function (id) {
            document.getElementById('ntfs' + id).remove();
        })
        insertSingleNotification(getNoNotificationsElement());
    }
}

function markAsReadOnServer(id) {
    // TODO
}

function getAndInsertNotifications() {
    //TODO
}

function removeNotification(id) {
    //TODO - remove on server
    removeNotificationNode(id);
}

function removeAllNotifications() {
    // TODO
    let ids = []; // result from server
    removeAllNotificationsNodes(ids);
}

function countUnreadNotificationsInServer() {
    return "4"; // TODO
}

