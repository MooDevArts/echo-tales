$(function() {
    // We'll allow chapters to be solved in any order.
    // unsolvedChapters holds the chapters that have not been solved yet.
    let unsolvedChapters = [1, 2, 3];
    
    // This function returns the expected mapping for a given chapter.
    // The mapping is an object where keys are droppable IDs and values are the expected draggable IDs.
    function getExpectedMapping(chapter) {
      if (chapter === 1) {
        return {
          "big-droppable-1": "big-draggable-1",
          "normal-droppable-1": "normal-draggable-1",
          "normal-droppable-2": "normal-draggable-2",
          "normal-droppable-3": "normal-draggable-3"
        };
      } else if (chapter === 2) {
        return {
          "big-droppable-1": "big-draggable-2",
          "normal-droppable-1": "normal-draggable-4",
          "normal-droppable-2": "normal-draggable-5",
          "normal-droppable-3": "normal-draggable-6"
        };
      } else if (chapter === 3) {
        return {
          "big-droppable-1": "big-draggable-3",
          "normal-droppable-1": "normal-draggable-7",
          "normal-droppable-2": "normal-draggable-8",
          "normal-droppable-3": "normal-draggable-9"
        };
      }
    }
    
    // Reset droppables (clear border, text, dropped data)
    function resetDroppables() {
      $(".droppable").each(function() {
        $(this)
          .data("dropped", null)
          .removeClass("ui-state-highlight")
          .css("border", "none")
          .find("p").html("Drop Here");
      });
    }
    
    // Initialize draggables: make all draggable and initially hide them.
    $(".draggable").draggable({
     // revert: "invalid"
    }).hide();
    
    // Initialize droppables.
    $(".droppable").droppable({
      accept: ".draggable",
      drop: function(event, ui) {
        const droppedItem = ui.helper.attr("id");
        $(this).data("dropped", droppedItem);
        $(this).addClass("ui-state-highlight").find("p").html("Placed!");
      },
      out: function(event, ui) {
        $(this).data("dropped", null);
        $(this).removeClass("ui-state-highlight").find("p").html("Drop Here");
      }
    });
    
    // Random Card button functionality:
    // When pressed, select one random card (draggable) from ANY hidden card.
    $("#random-card-btn").click(function(){
      let hiddenCards = $(".draggable:hidden");
      if (hiddenCards.length === 0) {
        alert("No more cards left!");
        return;
      }
      let randomIndex = Math.floor(Math.random() * hiddenCards.length);
      $(hiddenCards[randomIndex]).fadeIn(500);
    });
    
    // Check button functionality:
    // When pressed, the code checks if the current droppable placements match
    // any unsolved chapter's expected mapping.
    $(".check-button").click(function(){
      // Get the current dropped values from the droppables.
      let currentPlacement = {
        "big-droppable-1": $("#big-droppable-1").data("dropped"),
        "normal-droppable-1": $("#normal-droppable-1").data("dropped"),
        "normal-droppable-2": $("#normal-droppable-2").data("dropped"),
        "normal-droppable-3": $("#normal-droppable-3").data("dropped")
      };
      
      // Try to find a matching unsolved chapter.
      let solvedChapter = null;
      unsolvedChapters.forEach(chapter => {
        let mapping = getExpectedMapping(chapter);
        let match = true;
        for (let droppableId in mapping) {
          if (currentPlacement[droppableId] !== mapping[droppableId]) {
            match = false;
            break;
          }
        }
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
    
    // When a chapter is solved, disable its draggables and remove it from unsolvedChapters.
    function completeChapter(chapter) {
      // Disable the draggables for the solved chapter (and leave them visible with a visual cue)
      $(".draggable[data-chapter='" + chapter + "']").each(function(){
        $(this).draggable("disable").css({
          "opacity": "0",
          "pointer-events": "none"
        });
      });
      // Remove the solved chapter from the unsolvedChapters array.
      unsolvedChapters = unsolvedChapters.filter(ch => ch !== chapter);
      // Reset droppables for the next attempt.
      resetDroppables();
      
      if (unsolvedChapters.length === 0) {
        alert("Congratulations! All chapters completed!");
        $("#random-card-btn").prop("disabled", true);
        $(".check-button").prop("disabled", true);
      }
    }
  });
  