import $ from "jquery";
import "jquery-ui-dist/jquery-ui";

$(function () {
    $("#card").draggable();

    $("#dropbox").droppable({
        accept: "#card",
        drop: function (event, ui) {
            $(this).css("background-color", "lightgreen").text("Dropped!");
        }
    });
});
