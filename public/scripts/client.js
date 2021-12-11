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

// JS Execution begins here
$(document).ready(function() {

  //Handle attempt to submit form
  $(".new-tweet form").submit(function(e) {
    e.preventDefault();
    hideError(); //In case there was error earlier
    const textarea = $(this).find('textarea');
    const text = textarea.val().trim();
    if (text && text.length < MAX_TWEET_LENGTH) {
      const data = $(this).serialize();
      $.post("/tweets", data, (err, data) => {
        //Success - reload tweets and clear the form
        clearTweets();
        loadTweets();
        $(this).trigger("reset");
      });
    } else if (!text) {
      //Nothing entered or whitespace only
      displayError("Please enter some text.");
    } else {
      //Too many characters
      displayError("Your tweet is too long.");
    }
  });

  loadTweets();
});



