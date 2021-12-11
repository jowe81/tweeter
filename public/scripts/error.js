const displayError = (text, targetSelector = ERROR_CONTAINER_SELECTOR) => {
  const html = `
    <div class="error-message">
      <i class="fas fa-2x fa-exclamation-triangle"></i>
      <h3>An Error Occurred</h3>
      <span>${text}</span>
    </div>
  `;
  console.log("ERROR");
  $(ERROR_CONTAINER_SELECTOR).find('.slider').html(html);
  $(ERROR_CONTAINER_SELECTOR).find('.slider').slideDown(ERROR_SLIDE_TIME);
}

//Slide the error out of view - returns promise that resolve when animation completes
const hideError = (targetSelector = ERROR_CONTAINER_SELECTOR) => {
  return new Promise((resolve, reject) => {
    $(ERROR_CONTAINER_SELECTOR).find('.slider').slideUp(ERROR_SLIDE_TIME, () => {
      resolve();
    });
  });
};

const initError = (targetSelector = ERROR_CONTAINER_SELECTOR) => {
  $(ERROR_CONTAINER_SELECTOR).html('<div class="slider"></div>');
  $(ERROR_CONTAINER_SELECTOR).find(".slider").slideUp(0);
}

//Initialize
$(document).ready(function() {
  initError();
})
