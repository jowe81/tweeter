/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/* Return a string with elapsed time between two timestamps */
const getElapsedTime = (ts1, ts2) => {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;
  const MONTH = DAY * 30;
  const YEAR = MONTH * 12;

  //Milliseconds between timestamps
  const ms = Math.abs(ts1 - ts2);

  //Decide on a unit and generate string
  // - design conditionals to avoid having to deal with singular/plural :)
  let t;
  if (ms < 2 * MINUTE) {
    t = "moments";
  } else if (ms < 2 * HOUR) {
    t = `${Math.floor(ms / MINUTE)} minutes`;
  } else if (ms < 2 * DAY) {
    t = `${Math.floor(ms / HOUR)} hours`;
  } else if (ms < 2 * WEEK) {
    t = `${Math.floor(ms / DAY)} days`;
  } else if (ms < 2 * MONTH) {
    t = `${Math.floor(ms / WEEK)} weeks`;
  } else if (ms < 2 * YEAR) {
    t = `${Math.floor(ms / MONTH)} months`;
  } else {
    t = `${Math.floor(ms / YEAR)} years`;
  }

  return `${t} ago`;
};

// Copied from LHL Compass, make string XSS safe
// - seems a little clumsy...but is a quick fix.
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = (tweet) => {
  const elapsedTimeStr = getElapsedTime(Date.now(), tweet.created_at);
  //I wrote my own timeago-style function before getting to the instructions
  //to use the timeago library. Can switch to the library simply by uncommenting
  //the line below and commenting out the line above
  //const elapsedTimeStr = timeago.format(tweet.created_at);
  const article = `
    <article class="tweet">
      <header>
        <span class="user">
          <img src="${tweet.user.avatars}">          
          <span>${tweet.user.name}</span>  
        </span>
        <div class="user-handle">
          ${tweet.user.handle}
        </div>
      </header>
      <div>
        ${escape(tweet.content.text)}
      </div>
      <footer>
        <span class="days-ago">${elapsedTimeStr}</span>
        <div class="action-icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `;
  return article;
};



/* Sort tweets (newer ones first) */
const sortTweets = (tweets) => {
  return tweets.sort((a, b) => a.created_at > b.created_at ? -1 : 1);
};

/* Render an array of tweets */
const renderTweets = (tweets) => {
  sortTweets(tweets).forEach(tweet => {
    $(TWEETS_CONTAINER_SELECTOR).append(createTweetElement(tweet));
  });
};

//Empty tweets container
const clearTweets = () => {
  $(TWEETS_CONTAINER_SELECTOR).html('');
}

/* Load tweets via ajax and append them to the container */
const loadTweets = () => {
  $.get('/tweets', (data) => renderTweets(data));
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

$(document).ready(function() {

  //Handle attempt to submit form
  $(".new-tweet form").submit(function(e) {
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



  //Listen to scroll events, and show scroll-toggle-button as needed
  $(window).on('scroll', function() {
    const scrolledTo = $(window).scrollTop();
    showScrollToggleButton(scrolledTo > 400);
  });
  
  //Populate the page with tweets
  loadTweets();
  //Hide the new tweet form by default
  $(".new-tweet").slideUp(0);
  //Hide the scroll-toggle-button by default
  $("main > #scroll-toggle-button").hide();
});



