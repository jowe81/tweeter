//Show or hide the new tweet / compose button
const showComposeButton = (show) => {
  if (show) {
    $("nav .new-tweet-link").fadeIn();
  } else {
    $("nav .new-tweet-link").fadeOut();
  }  
}

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

//Is the new tweet section/form currently visible/slid down?
const newTweetFormIsVisible = () => {
  const newTweetSection = $("main .new-tweet")[0];
  //Use clientHeight to determine current state (0 => form is slid up/hidden)
  return newTweetSection.clientHeight > 0;
};

$(document).ready(() => {

  //Click on compose button: slide the new tweet form up/down
  $("nav .new-tweet-link").on('click', function() {
    const newTweetSection = $("main .new-tweet")[0];
    if (newTweetFormIsVisible()) {
      $(newTweetSection).slideUp();
      //If there is an error, it doesn't make sense for it to remain visible with the form out of view - hide it.
      hideError();
    } else {
      $(newTweetSection).slideDown(function() {
        //Pre-focus textarea after the animation completes
        $(this).find('form > #tweet-text').focus();
      });
    }
  });

  //Click on scroll-toggle-button: scroll up, show, and focus the new tweet form
  $("main #scroll-toggle-button").on("click", function() {
    $(window).scrollTop(0);
    if (!newTweetFormIsVisible()) {
      //Form is hidden - trigger the compose button to bring it in view and focus it
      $("nav .new-tweet-link").trigger("click");
    } else {
      //Form is already visible; just focus it
      $('main .new-tweet #tweet-text').focus();
    }
  });

  //User is typing: update remaining character count
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
  
  //User attempts to submit the form
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

  //User scrolls or resizes the window:
  // - show/position the scroll-toggle-button as needed
  // - show/hide the compose button at the top accordingly
  $(window).on('scroll resize', function() {
    const scrolledTo = $(window).scrollTop();
    const flipButtons = scrolledTo > 400;
    showScrollToggleButton(flipButtons);
    showComposeButton(!flipButtons);
  });
  

  //Init

  //Hide the new tweet form by default
  $(".new-tweet").slideUp(0);
  //Hide the scroll-toggle-button by default
  $("main > #scroll-toggle-button").hide();

});