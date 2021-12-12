/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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




$(document).ready(function() {
  
  //Populate the page with tweets
  loadTweets();
});



