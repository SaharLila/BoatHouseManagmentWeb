const chatEl = document.getElementById('chat');
const chatButton = document.getElementById('chatImgContainer');
let closeButton;
let chatMessagesDiv;
let chatHtml;
let scrollBarY;

// init chat

document.addEventListener('DOMContentLoaded', function () {
    chatHtml = document.createElement('html');
    chatHtml.innerHTML = html;
    chatEl.appendChild(chatHtml);
    getElements();
    initChatStyle();
    initEventListeners();
})

function getElements() {
    // closeButton =  document.getElementById('closeChat');

}

function initChatStyle() {
    chatEl.style.position = "fixed";
    chatEl.style.right = "8vh";
    chatEl.style.bottom = "2px solid";
    chatEl.style.width = "35vh";
    chatEl.style.zIndex = "1000";
}

// event handlers

function initEventListeners() {
    chatButton.addEventListener('click', toggleChat);
    // closeButton.addEventListener('click', toggleChat);
}

function toggleChat() {
    if (chatEl.style.display === "block") {
        chatEl.style.display = "none";
    } else {
        chatEl.style.display = "block";
        chatMessagesDiv.focus();
    }
}


const html = "<div id=\"chat-container\" class=\"container col-12\">\n" +
    "    <div id=\"chat-header\" class=\"row\">\n" +
    "        <div class=\"col-12 alert alert-primary\">\n" +
    "            Chat\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"chat-body\" class=\"row\">\n" +
    "        <div id=\"messages-container\" class=\"col-12\">\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div id=\"chat-footer\" class=\"row\">\n" +
    "        <div class=\"col-11\">\n" +
    "            <input id=\"chat-input\" type=\"text\" class=\"text-input\"\n" +
    "                   placeholder=\"Enter A Message...\">\n" +
    "        </div>\n" +
    "        <div class=\"col-1\">\n" +
    "            <i class=\"fa fa-envelope-o\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n";