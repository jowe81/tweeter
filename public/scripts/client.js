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
};

/* Load tweets via ajax and append them to the container */
const loadTweets = () => {
  $.get('/tweets', (data) => renderTweets(data));
};

//Show or hide the new tweet / compose button
const showComposeButton = (show) => {
  if (show) {
    $("nav .new-tweet-link").fadeIn();
  } else {
    $("nav .new-tweet-link").fadeOut();
  }
};

//Show or hide brand logo
const showBrand = (show) => {
  const brand = $(".brand");
  show ? brand.fadeIn() : brand.fadeOut();
};

//Show or hide the scroll-toggle-button
const showScrollToggleButton = (show) => {
  const scrollToggleButton = $("main > #scroll-toggle-button")[0];
  //Get browser viewport w/o address & bookmark bars, scrollbars, etc (actual document viewport)
  const html = $("html")[0];
  const viewPortHeight = html.clientHeight;
  const viewPortWidth = html.clientWidth;
  //Position the button relative to the bottom right of the viewport,
  //and depending on breakpoint
  let x = 70;
  let y = 100;
  if (window.innerWidth >= 1024) {
    //In the desktop view (2 columns) there is very little space in the right margin
    x = 60;
  }
  $(scrollToggleButton).css('top',`${viewPortHeight - y}px`);
  $(scrollToggleButton).css('left',`${viewPortWidth - x}px`);
  //Show/hide
  show ? $(scrollToggleButton).fadeIn() : $(scrollToggleButton).fadeOut();
};


$(document).ready(function() {
  //Populate the page with tweets
  loadTweets();


  //User scrolls or resizes the window:
  // - show/position the scroll-toggle-button as needed
  // - show/hide the compose button at the top accordingly
  // - show/hide the brand logo if viewport width < desktop breakpoint
  $(window).on('scroll resize', function() {
    const scrolledTo = $(window).scrollTop();
    const flipButtons = scrolledTo > 200;
    showScrollToggleButton(flipButtons);
    showComposeButton(!flipButtons);
    if (window.innerWidth < 1024) {
      showBrand(!flipButtons);
    } else {
      showBrand(true);
    }    
  });


});





