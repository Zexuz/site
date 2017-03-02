/**
 * Created by isak16 on 2017-03-02.
 */

/**
 *
 * @param counterImage
 * @param counterVideo
 * @param timestamp
 * @returns {{counter: {image: *, video: *}, timestamp: *, types: {image: boolean, video: boolean}}}
 */
function returnCounterObj(counterImage, counterVideo, timestamp) {
    return {
        counter: {
            image: counterImage,
            video: counterVideo
        },
        timestamp: timestamp,
        types: {
            image: true,
            video: false
        }
    };

}

/**
 *
 * @param type
 * @param counter
 * @returns {{requestSkip: *, videoCounter: *, imageCounter: *}}
 */
function getCountersFromType(type, counter) {
    var tempImageVar, tempVideoVar, requestSkip;
    if (type === "image") {
        requestSkip = tempImageVar = counter.counter.image + 15;
        tempVideoVar = counter.counter.video;
    }
    if (type === "video") {
        requestSkip = tempVideoVar = counter.counter.video + 15;
        tempImageVar = counter.counter.image;
    }

    return {
        requestSkip: requestSkip,
        videoCounter: tempVideoVar,
        imageCounter: tempImageVar
    }
}

/**
 *
 * @param obj
 * @returns {{subreddit: *, title: (*|string), type: *, linkToScrapedFrom: string, scrapedFromDomain: string, embedUrl: (*|$location.url|Function|b|Vg.url|ie.url), fromDomain: string, upvotes: *, timestamp: number, nsfw: *, thumbnail: boolean}}
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

/**
 *
 * @param sources
 * @param dataFrom
 * @returns {*}
 */
function returnSourcesInString(sources, dataFrom) {

    if (dataFrom === "domain") return sources;

    var sourcesString = '';
    for (var i = 0; i < sources.length; i++) {
        sourcesString += sources[i] + "+";
    }
    return sourcesString;
}


/**
 *
 * @param domainSources
 * @param requestData
 * @returns {*[]} Array of all functions to run to get more data
 *
 */
function returnAllRequestFuncs(domainSources, requestData) {
    //Permanent request, will always load more data from hotpage server
    var requestArr = [
        requestData.hotpage("image"),
        requestData.hotpage("video")
    ];

    if (shouldWeLoadMoreData(subredditSources)) {
        requestArr.push(requestData.customSubreddit(subredditSources, "r"));
    }

    //add domain requests
    for (var i = 0; i < domainSources.length; i++) {
        if (shouldWeLoadMoreData(domainSources[i])) {
            requestArr.push(requestData.customSubreddit(domainSources[i], "domain"));
        }
    }

    return requestArr;
}


function shouldWeLoadMoreData(sourceName) {
    var domainObj = getLocalStorage(sourceName);
    return (domainObj === null || domainObj.data.length < dataLimitLoadMore);
}