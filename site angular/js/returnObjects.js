/**
 * Created by isak16 on 2017-03-02.
 */

function returnVideoObject(obj) {
    var type;
    if (obj.post_hint === "rich:video") {
        type = "video";
    } else if (checkUrlImage(obj.url)) {
        type = "image";
    }

    var thumbnail = false;
    if (obj.media) {
        thumbnail = obj.media.oembed.thumbnail_url;
    }

    return {
        "subreddit": obj.subreddit,
        "title": obj.title,
        "type": type,
        "linkToScrapedFrom": "reddit.com" + obj.permalink,
        "scrapedFromDomain": "reddit.com",
        "embedUrl": obj.url,
        "fromDomain": obj.domain,
        "upvotes": obj.ups,
        "timestamp": Math.floor(Date.now() / 1000),
        "nsfw": obj.over_18,
        "thumbnail": thumbnail
    };
}

function executeAllReq(requestData) {
    var loadTheseSubs = shouldWeLoadMoreData(sourceObj.subreddits, "r");
    var type = requestTypeFromBools();

    //add mainflow
    if (type) {
        requestData.hotpage(type);
    }
    //add subs
    for(var p = 0; p < loadTheseSubs.length; p++){
        requestData.customSubreddit(loadTheseSubs[p], "r");
    }
    //add domain requests
    for (var i = 0; i < sourceObj.domains.length; i++) {
        if (shouldWeLoadMoreData(sourceObj.domains[i], "domain")) {
            requestData.customSubreddit(sourceObj.domains[i], "domain");
        }
    }
}

function shouldWeLoadMoreData(sourceName, from) {
    if (from === "r") {
        var tempArr = [];
        for (var i = 0; i < sourceName.length; i++) {
            var sourceObj = getLocalStorage(sourceName[i]);
            if (sourceObj === null || sourceObj.data.length <= dataLimitLoadMore) {
                tempArr.push(sourceName[i]);
            }
        }
        return tempArr;
    }
    if (from === "domain") {
        var domainObj = getLocalStorage(sourceName);
        return (domainObj === null || domainObj.data.length <= dataLimitLoadMore);
    }
}

function getMediaFromLocalStorage(source, amount, tempData) {
    var tempArr = tempData.data.slice(0, amount);
    tempData.data.splice(0, amount);
    saveLocalStorage(source, tempData);

    return tempArr;
}

function requestTypeFromBools() {
    var tempObj = getLocalStorage("typeBools");
    if (!tempObj) {
        tempObj = {
            imagesBool: true,
            videosBool: true
        };
        saveLocalStorage("typeBools", tempObj);
    }

    if (tempObj.imagesBool && !tempObj.videosBool) {
        return "images";
    } else if (!tempObj.imagesBool && tempObj.videosBool) {
        return "videos";
    } else if (!tempObj.imagesBool && !tempObj.videosBool) {
        return false;
    } else {
        return "both";
    }
}

function saveCounterObj(data) {
    var obj = getLocalStorage("counterObj");
    if (!obj) {
        obj = {};
    }
    if (!obj.imgHigh || !obj.imgLow) {
        obj.imgHigh = data.imgHigh;
        obj.imgLow = data.imgLow;
    }
    if (!obj.vidHigh || !obj.vidLow) {
        obj.vidHigh = data.vidHigh;
        obj.vidLow = data.vidLow;
    }

    var tempObj = {};
    if (data.from === "video") {
        tempObj.imgHigh = obj.imgHigh;
        tempObj.imgLow = obj.imgLow;
        if (data.gt !== -1) {
            tempObj.vidHigh = data.vidHigh;
            tempObj.vidLow = obj.vidLow;
        } else {
            tempObj.vidHigh = obj.vidHigh;
            tempObj.vidLow = data.vidLow;
        }

    } else if (data.from === "image") {
        tempObj.vidHigh = obj.vidHigh;
        tempObj.vidLow = obj.vidLow;
        if (data.gt !== -1) {
            tempObj.imgHigh = data.imgHigh;
            tempObj.imgLow = obj.imgLow;
        } else {
            tempObj.imgHigh = obj.imgHigh;
            tempObj.imgLow = data.imgLow;
        }
    }
    saveLocalStorage("counterObj", tempObj);
}

