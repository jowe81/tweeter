$(document).ready(() => {

  // unlike keypress, keyup fires AFTER the length of the text changed
  $("#tweet-text").keyup(function() {
    const remainingChars = 140 - $(this).val().length;
    //use relative DOM path to target the counter
    const counter = $(this).parent().find(".counter");
    //Turn text red on negative number
    remainingChars < 0 ? counter.addClass('red-text') : counter.removeClass('red-text');
    //Update counter
    counter.text(remainingChars);
  });

});