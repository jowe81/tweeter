//Is the new tweet section/form currently visible/slid down?
const newTweetFormIsVisible = () => {
  const newTweetSection = $("main .new-tweet")[0];
  //Use clientHeight to determine current state (0 => form is slid up/hidden)
  return newTweetSection.clientHeight > 0;
};

//Validate new tweet, return false on success, or error message
const validate = (textarea) => {
  let result = false;
  const text = textarea.val().trim();
  if (!text) {
    //No text or whitespace only
    result = "Please enter some text.";
  } else if (text.length > MAX_TWEET_LENGTH) {
    //Too long!
    result = `Your tweet is too long. No more than ${MAX_TWEET_LENGTH} characters, please.`;
  }
  return result;
};

//Update the remaining chars counter
const updateCounter = () => {
  const remainingChars = MAX_TWEET_LENGTH - $(".new-tweet #tweet-text").val().length;
  const counter = $(".new-tweet .counter");
  //Turn text red on negative number
  remainingChars < 0 ? counter.addClass('red-text') : counter.removeClass('red-text');
  //Update counter
  counter.text(remainingChars);
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
    updateCounter();
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
          $(".new-tweet #tweet-text").val('');
          updateCounter();
        });
      } else {
        //Validation failed - display error
        displayError(error);
      }
    });
  });

  //Init

  //Hide the new tweet form by default
  $(".new-tweet").slideUp(0);
  //Hide the scroll-toggle-button by default
  $("main > #scroll-toggle-button").hide();

});