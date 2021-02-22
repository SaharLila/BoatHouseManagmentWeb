const chatEl = document.getElementById('chat');
const chatButton = document.getElementById('chatImgContainer');
const chatCount = document.getElementById('chatCount');
let closeButton;
let chatMessagesDiv;
let chatHtml;
let scrollBarY;
let chatInput;
let sendIcon;
let chatVersion;

// init chat

document.addEventListener('DOMContentLoaded', function () {
    // chatHtml = document.createElement('html');
    // chatHtml.innerHTML = html;
    // chatEl.appendChild(chatHtml);
    // getElements();
    // initChatStyle();
    // initEventListeners();
})

function getElements() {
    closeButton = document.getElementById('closeChat');
    chatMessagesDiv = document.getElementById('messages-container');
    chatInput = document.getElementById('chat-input');
    sendIcon = document.getElementById('msgSendIcon');
}

function initChatStyle() {
    chatEl.style.position = "fixed";
    chatEl.style.right = "8vh";
    chatEl.style.bottom = "8vh";
    chatEl.style.width = "35vh";
    chatEl.style.zIndex = "1000";
}

// event handlers

function initEventListeners() {
    chatButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);
    chatInput.addEventListener('keyup', (e) => enterSendEventHandler(e));
    sendIcon.addEventListener('click', (e) => clickSendEventHandler(e));
    chatInput.addEventListener('mouseenter', () => chatInput.focus())
}

function enterSendEventHandler(e) {
    if (e.code === "Enter" && chatInput.value.length > 0) {
        createSelfMessage(chatInput.value);
        sendMessageToServer(chatInput.value);
        chatInput.value = "";
        chatInput.focus();
    }
}

function clickSendEventHandler() {
    if (chatInput.value.length > 0) {
        createSelfMessage(chatInput.value);
        sendMessageToServer(chatInput.value);
        chatInput.value = "";
        chatInput.focus();
        sendChatMessage()
    }
}

function toggleChat() {
    if (chatEl.style.display === "block") {
        chatEl.style.display = "none";
    } else {
        chatEl.style.display = "block";
    }
}


const html = "<div id=\"chat-container\" class=\"container col-12\">\n" +
    "    <div id=\"chat-header\" class=\"row\">\n" +
    "        <div class=\"col-12 alert alert-primary\">\n" +
    "            Chat\n" +
    "            <a id='closeChat' style='cursor: pointer'><i style='color: white' class='fa fa-close pull-right'></i></a>" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"chat-body\" class=\"row\">\n" +
    "        <div id=\"messages-container\" class=\"col-12\">\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"chat-footer\" class=\"row\">\n" +
    "        <div class=\"col-10\">\n" +
    "            <input id=\"chat-input\" type=\"text\" class=\"text-input\"\n" +
    "                   placeholder=\"Enter A Message...\">\n" +
    "        </div>\n" +
    "        <div id='msgSendIcon' class=\"col-2\">\n" +
    "            <i style='margin-top: 5px' class=\"fa fa-envelope-o\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n";


function createMessage(text, sender) {
    let html = "<div class=\"row chatMsgContainer\">\n" +
        "           <div class=\"col-10 chatMsg\">\n" +
        "                   <span class='msgTitle'>" + sender + ":<br></span>" + text +
        "           </div>\n" +
        "       </div>";

    let div = document.createElement('div');
    div.innerHTML = html;
    chatMessagesDiv.appendChild(div);
    div.scrollIntoView()
}

function createSelfMessage(text) {
    let html = "<div class=\"row chatMsgContainer\">\n" +
        "          <div class=\"col-2\"></div>\n" +
        "          <div class=\"col-10 chatMsg chatMsgSelf\">\n" +
        "              <span class='msgTitle'>You:<br></span>\n" +
        "              " + text + "\n" +
        "          </div>\n" +
        "      </div>";

    let div = document.createElement('div');
    div.innerHTML = html;
    chatMessagesDiv.appendChild(div);
    div.scrollIntoView()
}

function sendMessageToServer(text) {
    // TODO
}

function receiveMessages() {
    //TODO
}

function getCurrentVersion() {
    //TODO
}

function updateVersion() {
    let old = chatVersion;
    let count = 0;
    chatVersion = getCurrentVersion();

    if (old !== undefined) {
        count = chatVersion.count - old.count;
    }
    chatCount.innerText = count.toString();
}