const rowersCountTextEl = document.getElementById("rowersCountText");
const boatsCountTextEl = document.getElementById("boatsCountText");
const activitiesCountTextEl = document.getElementById("activitiesCountText");
const adminFloatStatsEl = document.getElementById("adminFloatStats");


document.addEventListener("DOMContentLoaded", function () {
    getLoggedInUser().then(loggedInUser => {
        if (loggedInUser.isAdmin) {
            getBoatsFromServer().then(boats => boatsCountTextEl.innerText = boats.length);
            getRowersFromServer().then(rowers => rowersCountTextEl.innerText = rowers.length);
            getRowingActivitiesFromServer().then(activities => activitiesCountTextEl.innerText = activities.length);
        } else {
            adminFloatStatsEl.remove();
        }
    });

});