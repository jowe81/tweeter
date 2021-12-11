/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const getElapsedTime = (date1, date2) => {

};

const createTweetElement = (tweet) => {
  const daysAgo = tweet.created_at
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
        ${tweet.content.text}
      </div>
      <footer>
        <span class="days-ago">${daysAgo}</span>
        <div class="action-icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `;
  return article;
}

