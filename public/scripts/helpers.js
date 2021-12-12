//Helper functions

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