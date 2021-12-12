//Show or hide the scroll-toggle-button
const showScrollToggleButton = (show) => {
  const scrollToggleButton = $("main > #scroll-toggle-button")[0];
  //Get browser viewport w/o address & bookmark bars, scrollbars, etc (actual document viewport)
  const html = $("html")[0];
  const viewPortHeight = html.clientHeight;
  const viewPortWidth = html.clientWidth;
  //Position the button relative to the bottom right of the viewport
  $(scrollToggleButton).css('top',`${viewPortHeight - 150}px`);
  $(scrollToggleButton).css('left',`${viewPortWidth - 150}px`);
  //Show/hide
  show ? $(scrollToggleButton).fadeIn() : $(scrollToggleButton).fadeOut();
};

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
  $("#tweet-text").on('keyup', function() {
    const remainingChars = MAX_TWEET_LENGTH - $(this).val().length;
    //use relative DOM path to target the counter
    const counter = $(this).parent().find(".counter");
    //Turn text red on negative number
    remainingChars < 0 ? counter.addClass('red-text') : counter.removeClass('red-text');
    //Update counter
    counter.text(remainingChars);
  });
  
  //Handle attempt to submit form
  $(".new-tweet form").on('submit', function(e) {
    e.preventDefault();
    hideError().then(() => {
      const error = validate($(this).find('textarea'));
      if (!error) {
        //Validation passed - submit new tweet
        const data = $(this).serialize();
        $.post("/tweets", data, (err, data) => {
          //Success - reload tweets and clear the form
          clearTweets();
          loadTweets();
          $(this).trigger("reset");
        });
      } else {
        //Validation failed - display error
        displayError(error);
      }
    });
  });

  //Listen to scroll and resize events; show/position the scroll-toggle-button as needed
  $(window).on('scroll resize', function() {
    const scrolledTo = $(window).scrollTop();
    showScrollToggleButton(scrolledTo > 400);
  });
  

  //Init
  
  //Hide the new tweet form by default
  $(".new-tweet").slideUp(0);
  //Hide the scroll-toggle-button by default
  $("main > #scroll-toggle-button").hide();

});