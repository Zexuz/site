/**
 * Created by isak16 on 2017-03-02.
 */
var timestamp = Math.floor(new Date() / 1000);

var limit = 30;
var displayAmount = 15;
var dataLimitLoadMore = 15;



var subredditSources = ["reckful", "idubbbz", "h3h3productions"];
var domainSources = ["imgur.com", "youtube.com"];

var sourceObj = {
    subreddits: subredditSources,
    domains: domainSources
};


var counter;
if (getLocalStorage("counter") !== null) {
    counter = getLocalStorage("counter");
} else {
    saveLocalStorage("counter", returnCounterObj(0, 0, timestamp));
    counter = returnCounterObj(0, 0, timestamp);
}