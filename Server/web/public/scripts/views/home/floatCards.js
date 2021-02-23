const rowersCountTextEl = document.getElementById("rowersCountText");
const boatsCountTextEl = document.getElementById("boatsCountText");
const activitiesCountTextEl = document.getElementById("activitiesCountText");


document.addEventListener("DOMContentLoaded", function () {
 getBoatsFromServer().then(boats => boatsCountTextEl.innerText = boats.length);
 getRowersFromServer().then(rowers => rowersCountTextEl.innerText = rowers.length);
 getRowingActivitiesFromServer().then(activities => activitiesCountTextEl.innerText = activities.length);

});