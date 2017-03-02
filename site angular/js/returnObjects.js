/**
 * Created by isak16 on 2017-03-02.
 */

function returnCounterObj (counterImage, counterVideo, timestamp){
    return{
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

function getCountersFromType (type, counter){
    var tempImageVar, tempVideoVar, requestSkip;
    if(type === "image"){
        requestSkip = tempImageVar = counter.counter.image + 15;
        tempVideoVar = counter.counter.video;
    }
    if(type === "video"){
        requestSkip = tempVideoVar = counter.counter.video + 15;
        tempImageVar = counter.counter.image;
    }

    return {
        requestSkip: requestSkip,
        videoCounter: tempVideoVar,
        imageCounter: tempImageVar
    }
}


function returnVideoObject(obj){
    var type;
    if(obj.post_hint === "rich:video"){
        type = "video";
    }else if(checkUrlImage(obj.url)){
        type = "image";
    }

    var thumbnail = false;
    if(obj.media){
        thumbnail = obj.media.oembed.thumbnail_url;
    }
    
    return {
        "subreddit": obj.subreddit,
        "title" : obj.title,
        "type": type,
        "linkToScrapedFrom": "reddit.com"+obj.permalink,
        "scrapedFromDomain":"reddit.com",
        "embedUrl": obj.url,
        "fromDomain": obj.domain,
        "upvotes": obj.ups,
        "timestamp": Math.floor(Date.now() / 1000),
        "nsfw" : obj.over_18,
        "thumbnail" : thumbnail
    };
}

function returnSourcesInString(sources){
    console.log(sources);
    if(sources.length = 1) return sources;

    var sourcesString = '';
    for(var i = 0; i < sources.length; i++){
        sourcesString += sources[i]+"+";
    }
    return sourcesString;
}

function returnAllRequestFuncs(domainSources, requestData){
   var requestArr = [
        requestData.hotpage("image"),
        requestData.hotpage("video"),
        requestData.customSubreddit(subredditSources, "r")
    ];

    for(var i = 0; i < domainSources.length; i++){
        console.log("damn");
        requestArr.push(requestData.customSubreddit(domainSources[i], "domain"));
    }
    return requestArr;
}