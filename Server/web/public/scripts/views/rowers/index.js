document.addEventListener("DOMContentLoaded", function () {
    createTable();
});

const bodyTest = document.getElementById("bodyTest");

function createTable() {
    let names = ["col1", "col2", "col3", "col4", 'col5', 'col5', 'col5'];
    let table = createEmptyTable(names)
    bodyTest.appendChild(table);
    let textEl = [];
    textEl.push(document.createTextNode("row1"));
    textEl.push(document.createTextNode("row2"));
    textEl.push(document.createTextNode("row3"));
    textEl.push(document.createTextNode("row4"));
    textEl.push(document.createTextNode("row5"));
    let btn = document.createElement("button");
    btn.innerText = "BTN TEST"
    // btn.style.width = "999px";
    // btn.style.height = "999px";
    textEl.push(btn);
    table.querySelector("#tableBody").appendChild(getRowInTable(textEl, 1));
}

function getRowInTable(rowElements, rowNumber) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.scope = "row";
    th.innerText = rowNumber;
    tr.appendChild(th);

    rowElements.forEach(element => {
        let td = document.createElement("td");
        td.appendChild(element);
        tr.appendChild(td);
    });

    return tr;
}


function createEmptyTable(colNames) {
    let res = document.createElement("div");
// res.appendChild(getBoostrapLinkEl()); //TODO - עושה בעיות
    let table = document.createElement("table");
    res.appendChild(table);
    table.className += "table table-striped";

//build the head
    let head = document.createElement("thead");
    let tr = document.createElement("tr");
    tr.id = "tableHead"
    let indexCol = document.createElement("th");
    indexCol.scope = "col";
    indexCol.innerText = "#"
    tr.appendChild(indexCol);
    head.appendChild(tr);
    colNames.forEach(name => {
        let th = document.createElement("th");
        th.scope = "col";
        th.innerText = name;
        tr.appendChild(th);
    });

    table.appendChild(head);

//build tbody:
    let tbody = document.createElement("tbody");
    tbody.className += ".table-striped";
    tbody.id = "tableBody";
    table.appendChild(tbody);

    return res;
}