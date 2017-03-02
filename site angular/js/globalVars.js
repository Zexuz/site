/**
 * Created by isak16 on 2017-03-02.
 */
var timestamp = Math.floor(new Date() / 1000);
var counter;
var limit = 15;
var subredditSources = ["reckful", "idubbz"];
var domainSources = ["imgur.com", "youtube.com"];


if (getLocalStorage("counter") !== null) {
    counter = getLocalStorage("counter");
} else {
    saveLocalStorage("counter", returnCounterObj(0, 0, timestamp));
    counter = returnCounterObj(0, 0, timestamp);
}