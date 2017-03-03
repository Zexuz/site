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
function returnCounterObj(counterImage, counterVideo, timestamp, images, videos) {
    return {
        counter: {
            image: counterImage,
            video: counterVideo
        },
        timestamp: timestamp,
        types: {
            image: images,
            video: videos
        }
    };

}

function setImagesVideosBool(counter, images, videos){
    return {
        counter: {
            image: counter.counter.image,
            video: counter.counter.video
        },
        timestamp: counter.timestamp,
        types: {
            image: images,
            video: videos
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
        requestSkip = tempImageVar = counter.counter.image + limit;
        tempVideoVar = counter.counter.video;
    }
    if (type === "video") {
        requestSkip = tempVideoVar = counter.counter.video + limit;
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
    var requestArr = [];

    if (shouldWeLoadMoreData("image")) {
        requestArr.push(requestData.hotpage("image"));
    }

    if (shouldWeLoadMoreData("video")) {
        requestArr.push(requestData.hotpage("video"));
    }

    if (shouldWeLoadMoreData("subbredditsData")) {
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

function removeEmptyArrays(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].length === 0) {
            arr.splice(i, 1);
        }
    }
    return arr;
}


function getMediaFromLocalStorage(source, amount) {
    var tempData = getLocalStorage(source);

    if (!tempData || tempData.data.length < amount) return [];

    var tempArr = tempData.data.slice(0, amount);
    tempData.data.splice(0, amount);

    saveLocalStorage(source, tempData);
    return tempArr;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}