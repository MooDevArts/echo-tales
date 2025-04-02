import { BrowserMultiFormatReader } from '@zxing/browser';

const videoElement = document.getElementById('video');
const outputElement = document.getElementById('output');
const codeReader = new BrowserMultiFormatReader();

async function startScanner() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length > 0) {
            const deviceId = videoDevices[0].deviceId;

            codeReader.decodeFromVideoDevice(deviceId, videoElement, (result, err) => {
                if (result) {
                    const scannedValue = result.text.trim(); // Get scanned QR code value
                    outputElement.textContent = scannedValue;
                    console.log("QR Code Scanned:", scannedValue);

                    // Show the corresponding draggable item
                    showDraggableItem(scannedValue);
                }
            });
        } else {
            console.error("No video input devices found.");
        }
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

// Function to show draggable item based on QR code value
function showDraggableItem(scannedValue) {
    const mapping = {
        "1": "#normal-draggable-1",
        "2": "#normal-draggable-2",
        "3": "#normal-draggable-3",
        "4": "#normal-draggable-4",
        "5": "#normal-draggable-5",
        "6": "#normal-draggable-6",
        "7": "#normal-draggable-7",
        "8": "#normal-draggable-8",
        "9": "#normal-draggable-9",
        "10": "#big-draggable-1",
        "11": "#big-draggable-2",
        "12": "#big-draggable-3"
    };

    const draggableSelector = mapping[scannedValue];
    if (draggableSelector) {
        $(draggableSelector).fadeIn(500);
    } else {
        console.warn("Scanned value does not match any draggable item.");
    }
}

startScanner();

$(function() {
    let unsolvedChapters = [1, 2, 3];

    function getExpectedMapping(chapter) {
        const mappings = {
            1: {
                "big-droppable-1": "big-draggable-1",
                "normal-droppable-1": "normal-draggable-1",
                "normal-droppable-2": "normal-draggable-2",
                "normal-droppable-3": "normal-draggable-3"
            },
            2: {
                "big-droppable-1": "big-draggable-2",
                "normal-droppable-1": "normal-draggable-4",
                "normal-droppable-2": "normal-draggable-5",
                "normal-droppable-3": "normal-draggable-6"
            },
            3: {
                "big-droppable-1": "big-draggable-3",
                "normal-droppable-1": "normal-draggable-7",
                "normal-droppable-2": "normal-draggable-8",
                "normal-droppable-3": "normal-draggable-9"
            }
        };
        return mappings[chapter] || {};
    }

    function resetDroppables() {
        $(".droppable").each(function() {
            $(this).data("dropped", null).removeClass("ui-state-highlight").find("p").html("Drop Here");
        });
    }

    $(".draggable").draggable().hide();

    $(".droppable").droppable({
        accept: ".draggable",
        drop: function(event, ui) {
            const droppedItem = ui.helper.attr("id");
            $(this).data("dropped", droppedItem).addClass("ui-state-highlight").find("p").html("Placed!");
        },
        out: function(event, ui) {
            $(this).data("dropped", null).removeClass("ui-state-highlight").find("p").html("Drop Here");
        }
    });

    $(".check-button").click(function() {
        let currentPlacement = {
            "big-droppable-1": $("#big-droppable-1").data("dropped"),
            "normal-droppable-1": $("#normal-droppable-1").data("dropped"),
            "normal-droppable-2": $("#normal-droppable-2").data("dropped"),
            "normal-droppable-3": $("#normal-droppable-3").data("dropped")
        };

        let solvedChapter = null;
        unsolvedChapters.forEach(chapter => {
            let mapping = getExpectedMapping(chapter);
            let match = Object.keys(mapping).every(droppableId => currentPlacement[droppableId] === mapping[droppableId]);
            if (match) {
                solvedChapter = chapter;
            }
        });

        if (solvedChapter !== null) {
            alert("Chapter " + solvedChapter + " completed!");
            completeChapter(solvedChapter);
        } else {
            alert("Some items are not placed correctly, or the order is wrong!");
        }
    });

    function completeChapter(chapter) {
        $(".draggable[data-chapter='" + chapter + "']").each(function() {
            $(this).draggable("disable").css({
                "opacity": "0",
                "pointer-events": "none"
            });
        });

        unsolvedChapters = unsolvedChapters.filter(ch => ch !== chapter);
        resetDroppables();

        if (unsolvedChapters.length === 0) {
            alert("Congratulations! All chapters completed!");
            $("#random-card-btn").prop("disabled", true);
            $(".check-button").prop("disabled", true);
        }
    }
});
