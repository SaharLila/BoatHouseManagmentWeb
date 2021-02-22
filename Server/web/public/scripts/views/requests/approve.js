export function getApproveDiv(id) {
    let div = document.createElement("div");
    div.innerHTML = getApproveHtml();
    div.querySelector("#requestId").value = id;

    return div;
}

function getApproveHtml() {
    return "<div class=\"content\">\n" +
        "    <div class=\"container-fluid\">\n" +
        "        <div class=\"row\">\n" +
        "            <div class=\"col-12\">\n" +
        "                <div class=\"card\">\n" +
        "                    <div class=\"card-body\" id=\"tableContainer\">\n" +
        "                        <div class=\"card card-nav-tabs card-plain\">\n" +
        "                            <div class=\"card-body\">\n" +
        "                                <input type=\"hidden\" id=\"requestId\">\n" +
        "                                <div>\n" +
        "                                    <div class=\"progress\">\n" +
        "                                        <div id=\"progressBar\" class=\"progress-bar bg-info\" role=\"progressbar\"\n" +
        "                                             style=\"width: 25%\"\n" +
        "                                             aria-valuenow=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                                <div class=\"tab-content text-center\">\n" +
        "                                    <!--step zero div-->\n" +
        "                                    <div class=\"tab-pane active\" id=\"selectBoatTab\">\n" +
        "                                        <div style=\"margin-top:50px; text-align: center\">\n" +
        "                                            <h3 style='font-family: \"Arial\", sans-serif'>SELECT A BOAT TYPE FOR THE\n" +
        "                                                ROWING ACTIVITY</h3>\n" +
        "                                            <br>\n" +
        "                                            <div style=\"margin-bottom: 50px;\" class=\"row col-md-12\">\n" +
        "                                                <div class=\"col-md-2\"></div>\n" +
        "                                                <div class=\"col-md-8\">\n" +
        "                                                    <select id=\"boatSelection\" class=\"select2El form-control\"\n" +
        "                                                            data-style=\"btn btn-link\">\n" +
        "                                                    </select>\n" +
        "                                                </div>\n" +
        "                                                <div class=\"col-md-2\"></div>\n" +
        "                                            </div>\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                    <!--step Two Div-->\n" +
        "                                    <div class=\"tab-pane\" id=\"addRowersTab\">\n" +
        "                                        <div class=\"row\">\n" +
        "                                            <div class=\"col-md-12\" style=\"text-align: center\">\n" +
        "                                                <br>\n" +
        "                                                <br>\n" +
        "                                                <h4 style='font-family: \"Arial\", sans-serif'>YOU HAVE TOO MANY ROWERS IN\n" +
        "                                                    YOUR REQUEST, SELECT WHICH ROWERS TO REMOVE</h4>\n" +
        "                                                <h6 style='font-family: \"Arial\", sans-serif'>A NEW REQUEST WILL BE\n" +
        "                                                    GENERATED FOR THESE ROWERS</h6>\n" +
        "                                                <br>\n" +
        "                                            </div>\n" +
        "                                        </div>\n" +
        "                                        <div class=\"row\" style=\"padding-top: 20px\">\n" +
        "                                            <div class=\"col-md-12\" style=\"text-align: center\">\n" +
        "                                                <h6 style=\"color: red\" id=\"howManyLeftText\">You have to remove X more\n" +
        "                                                    rowers</h6>\n" +
        "                                            </div>\n" +
        "                                        </div>\n" +
        "                                        <div class=\"row\">\n" +
        "                                            <div class=\"col-md-5\" style=\"text-align: center\">\n" +
        "                                                <h6>Request Rowers</h6>\n" +
        "                                                <select id=\"requestRowersSelect\" class=\"rowersSelect form-select\"\n" +
        "                                                        size=\"9\">\n" +
        "\n" +
        "                                                </select>\n" +
        "                                            </div>\n" +
        "                                            <div class=\"col-12 col-md-2\"\n" +
        "                                                 style=\"padding-top: 20px; padding-bottom: 20px;\">\n" +
        "                                                <div style=\"margin-top: 20px; margin-bottom: 20px;\" class=\"row\">\n" +
        "                                                    <div class=\"col-6 col-md-12\">\n" +
        "                                                        <button id=\"deleteFromRequestBtn\"\n" +
        "                                                                class=\"btn-sm btn-round btn-light\">\n" +
        "                                                            <img src=\"/public/images/right-arrow.png\"\n" +
        "                                                                 alt=\"Delete Rower From Request\">\n" +
        "                                                        </button>\n" +
        "                                                    </div>\n" +
        "                                                    <div class=\"approveRequestRightButton col-6 col-md-12\">\n" +
        "                                                        <button id=\"addToRequestBtn\" class=\"btn-sm btn-round btn-light\">\n" +
        "                                                            <img src=\"/public/images/left-arrow.png\"\n" +
        "                                                                 alt=\"Return Rower To Request\">\n" +
        "                                                        </button>\n" +
        "                                                    </div>\n" +
        "                                                </div>\n" +
        "                                            </div>\n" +
        "                                            <div class=\"col-md-5\" style=\"text-align: center\">\n" +
        "                                                <h6>Deleted Rowers</h6>\n" +
        "                                                <select id=\"deleteRowersSelect\" class=\"rowersSelect form-select\"\n" +
        "                                                        size=\"9\">\n" +
        "                                                </select>\n" +
        "                                            </div>\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                    <!--step three div-->\n" +
        "                                    <div class=\"tab-pane\" id=\"removeRowersTab\">\n" +
        "                                        <div style=\"margin-top:50px; text-align: center\">\n" +
        "                                            <h4 style='font-family: \"Arial\", sans-serif'>YOU DON'T HAVE ENOUGH ROWERS IN YOUR REQUEST</h4>\n" +
        "                                            <h5 style='font-family: \"Arial\", sans-serif'>SELECT ROWERS THAT WILL BE ADDED TO THE REQUEST</h5>\n" +
        "                                            <br>\n" +
        "                                        </div>\n" +
        "                                        <div class=\"row\" style=\"padding-top: 20px\">\n" +
        "                                            <div class=\"col-md-12\" style=\"text-align: center\">\n" +
        "                                                <h6 style=\"color: red\" id=\"howManyToAddText\">You have to add X more\n" +
        "                                                    rowers</h6>\n" +
        "                                            </div>\n" +
        "                                        </div>\n" +
        "                                        <div class=\"row\">\n" +
        "                                            <div class=\"col-md-5\" style=\"text-align: center\">\n" +
        "                                                <h6>Available Rowers</h6>\n" +
        "                                                <select id=\"availableRowersSelect\" class=\"rowersSelect form-select\"\n" +
        "                                                        size=\"9\">\n" +
        "\n" +
        "                                                </select>\n" +
        "                                            </div>\n" +
        "                                            <div class=\"col-12 col-md-2\"\n" +
        "                                                 style=\"padding-top: 20px; padding-bottom: 20px;\">\n" +
        "                                                <div style=\"margin-top: 20px; margin-bottom: 20px;\" class=\"row\">\n" +
        "                                                    <div class=\"col-6 col-md-12\">\n" +
        "                                                        <button id=\"joinRowerToRequestBtn\"\n" +
        "                                                                class=\"btn-sm btn-round btn-light\">\n" +
        "                                                            <img src=\"/public/images/right-arrow.png\"\n" +
        "                                                                 alt=\"Add Rower To Request\">\n" +
        "                                                        </button>\n" +
        "                                                    </div>\n" +
        "                                                    <div class=\"approveRequestRightButton col-6 col-md-12\">\n" +
        "                                                        <button id=\"moveRowerBackBtn\" class=\"btn-sm btn-round btn-light\">\n" +
        "                                                            <img src=\"/public/images/left-arrow.png\"\n" +
        "                                                                 alt=\"Move Rower Back\">\n" +
        "                                                        </button>\n" +
        "                                                    </div>\n" +
        "                                                </div>\n" +
        "                                            </div>\n" +
        "                                            <div class=\"col-md-5\" style=\"text-align: center\">\n" +
        "                                                <h6>New Rowers</h6>\n" +
        "                                                <select id=\"newRowersSelect\" class=\"rowersSelect form-select\"\n" +
        "                                                        size=\"9\">\n" +
        "                                                </select>\n" +
        "                                            </div>\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                    <div style=\"margin-top: 50px\" class=\"tab-pane\" id=\"infoTab\">\n" +
        "                                    <H4>Request Successfully approved !</H4>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"row\" style=\"text-align: center; margin-bottom: 20px;\">\n" +
        "                                        <div class=\"col-md-2\"></div>\n" +
        "                                        <ul id=\"errors\" style=\"color: red\">\n" +
        "                                        </ul>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"row\" style=\"text-align: center; margin-bottom: 20px;\">\n" +
        "                                        <ul id=\"errorsLevelOne\" style=\"color: red\">\n" +
        "                                        </ul>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                            <hr>\n" +
        "                            <div class=\"card-footer\">\n" +
        "                                <div class=\"row col-md-12\">\n" +
        "                                    <div class=\"col-md-6\"></div>\n" +
        "                                    <div class=\"col-md-3\">\n" +
        "                                        <button disabled class=\"btn btn-block btn-dark\" id=\"backStepBtn\">Back</button>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"col-md-3\">\n" +
        "                                        <button class=\"btn btn-block btn-blue\" id=\"nextStepBtn\">Next</button>\n" +
        "                                    </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "    <script type=\"application/javascript\" src=\"/public/scripts/views/rowing-activity/approve.js\"></script>\n" +
        "</div>\n";
}