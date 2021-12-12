$(document).ready(() => {

  //Slide the new tweet form up/down when compose button is clicked
  $("nav .new-tweet-link").on('click', function() {
    const newTweetSection = $("main .new-tweet")[0];
    //Use clientHeight to determine current state (0 => form is slid up/hidden)
    if (newTweetSection.clientHeight) {
      $(newTweetSection).slideUp();
    } else {
      $(newTweetSection).slideDown(function() {
        //Pre-focus textarea after the animation completes
        $(this).find('form > #tweet-text').focus();
      });
    }
  });

  //Update remaining character count while user types
  // - unlike keypress, keyup fires AFTER the length of the text changed
  $("#tweet-text").keyup(function() {
    const remainingChars = MAX_TWEET_LENGTH - $(this).val().length;
    //use relative DOM path to target the counter
    const counter = $(this).parent().find(".counter");
    //Turn text red on negative number
    remainingChars < 0 ? counter.addClass('red-text') : counter.removeClass('red-text');
    //Update counter
    counter.text(remainingChars);
  });

});