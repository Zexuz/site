/**
 * Created by isak16 on 2017-02-27.
 */
var app = angular.module('app', []);

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**',
        'https://clips.twitch.tv/**'
    ]);
});

app.controller('mainflow', function ($scope, $rootScope, $http, $q, requestData) {

    $scope.dataArr = [];
    $scope.nsfw = false;
    $scope.sourceArr = [];
    $scope.domainArr = [];
    $scope.display = {};

    if (getLocalStorage("mainflowBool") === null) {
        $scope.display.mainflow = true;
    } else {
        $scope.display.mainflow = getLocalStorage("mainflowBool");
    }
    $scope.setMainFlowBool = function () {
        saveLocalStorage("mainflowBool", $scope.display.mainflow);
    };

    if (getLocalStorage("displayVideoBool") === null) {
        $scope.display.video = true;
    } else {
        $scope.display.video = getLocalStorage("displayVideoBool");
    }
    $scope.setDisplayVideoBool = function () {
        saveLocalStorage("displayVideoBool", $scope.display.video);
    };

    if (getLocalStorage("displayImageBool") === null) {
        $scope.display.image = true;
    } else {
        $scope.display.image = getLocalStorage("displayImageBool");
    }
    $scope.setDisplayImageBool = function () {
        saveLocalStorage("displayImageBool", $scope.display.image);
    };



    $scope.filterMainflow = function(item) {
        return $scope.display.mainflow && item.incId || !item.incId;
    };

    $scope.filterType = function(item) {
        if($scope.display){
            return $scope.display[item.type];
        }else {
            return false;
        }
    };

    $scope.filterReddit = function (item) {
     return $scope.sourceArr.indexOf(item.subreddit) !== -1 || item.incId || item.userDomain;
    };

    $scope.filterDomain = function (item) {
     return $scope.domainArr.indexOf(item.customDomain) !== -1 || item.incId || !item.userDomain;
    };



    var reddits = getLocalStorage("reddits");
    var domains = getLocalStorage("domains");
    if(reddits) $scope.sourceArr = reddits;
    if(domains) $scope.domainArr = domains;


    $scope.removeItemReddit = function(index){
        $scope.sourceArr.splice(index, 1);
        saveLocalStorage("reddits", $scope.sourceArr);
    };
    $scope.removeItemDomain = function(index){
        $scope.domainArr.splice(index, 1);
        saveLocalStorage("domains", $scope.domainArr);
    };


    $scope.addSrc = function () {
        if($scope.input.type === "Reddit"){
            $scope.sourceArr.push($scope.input.source);
            saveLocalStorage("reddits", $scope.sourceArr);
            var temparr2 = [];
            temparr2.push($scope.input.source);
            executeAllReq(requestData, temparr2, [], $scope.display, function () {
                $scope.displayData(temparr2, []);
            });
        }
        if($scope.input.type === "Domain"){
            $scope.domainArr.push($scope.input.source);
            saveLocalStorage("domains", $scope.domainArr);
            var temparr = [];
            temparr.push($scope.input.source);
            executeAllReq(requestData, [], temparr, $scope.display, function () {
                $scope.displayData([], temparr);
            });
        }
    };

    $scope.getData = function(){
        executeAllReq(requestData, $scope.sourceArr, $scope.domainArr, $scope.display, function () {
            $scope.displayData($scope.sourceArr, $scope.domainArr);
        });
    };

    $scope.displayData = function(sourceArr, domainArr){
        var dataArrsDom = [];
        var dataArrsSub = [];
        var amountEachSubb = Math.ceil((displayAmount/(sourceArr.length + domainArr.length)));


        var images = getSessionLocalStorage("images");
        var videos = getSessionLocalStorage("videos");

        if(images){
            dataArrsSub = dataArrsSub.concat(images);
            saveSessionLocalStorage("images", "");
        }
        if(videos){
            dataArrsSub = dataArrsSub.concat(videos);
            saveSessionLocalStorage("videos", "");
        }

        angular.forEach(sourceArr, function (value) {
            var tempData1 = getLocalStorage(value);
            if(tempData1){
                dataArrsSub = dataArrsSub.concat(getMediaFromLocalStorage(value, amountEachSubb, tempData1));
            }
        });

        angular.forEach(domainArr, function (value) {
            var tempData = getLocalStorage(value);
            if(tempData){
                dataArrsDom = dataArrsDom.concat(getMediaFromLocalStorage(value, amountEachSubb, tempData));
            }
        });

        dataArrsDom = dataArrsDom.concat(dataArrsSub);
        console.log(dataArrsDom);
        if(dataArrsDom.length === 0){
            console.log("ERROR: No data to display, please check your src list or try load again");
        }else{
            $scope.dataArr = dataArrsDom;
        }

    };

    $scope.dataType = function (type, domain) {
        if(type === "video"){
            switch(domain) {
                case "youtube.com":
                    return "youtube";
                    break;
                case "youtu.be":
                    return "youtube";
                    break;
                case "gfycat.com":
                    return "gfycat";
                    break;
                case "clips.twitch.tv":
                    return "twitch";
                    break;
                default:
                    return false;
            }
        }else if(type === "image"){
            return "image";
        }else {
            return false;
        }
    };

    $scope.getData();
});

app.controller("youtubeController", function ($scope) {
    $scope.videoId = function getYoutubeVideoId(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        p = (url.match(p)) ? RegExp.$1 : false;
        if(p){
            return 'https://www.youtube.com/embed/'+p+'?rel=0&autoplay=true';
        }else {
            return false;
        }
    }
});

app.controller("twitchController", function ($scope) {
    $scope.play = false;
    $scope.videoId = function getTwitchVideoId(url) {
        url = url.replace('https://clips.twitch.tv/','');
        return 'https://clips.twitch.tv/embed?clip='+url+'&autoplay=true';
    };

});


app.controller("gfycatController", function ($scope) {
    $scope.videoId = function getGfyCat(url){
        var oldUrl = url;
        oldUrl = oldUrl.replace('https://gfycat.com/','');
        return oldUrl;
    }

});


function htmlbodyHeightUpdate(){
    var height3 = $( window ).height()
    var height1 = $('.nav').height()+50
    height2 = $('.main').height()
    if(height2 > height3){
        $('html').height(Math.max(height1,height3,height2)+10);
        $('body').height(Math.max(height1,height3,height2)+10);
    }
    else
    {
        $('html').height(Math.max(height1,height3,height2));
        $('body').height(Math.max(height1,height3,height2));
    }

}
$(document).ready(function () {
    htmlbodyHeightUpdate()
    $( window ).resize(function() {
        htmlbodyHeightUpdate()
    });
    $( window ).scroll(function() {
        height2 = $('.main').height()
        htmlbodyHeightUpdate()
    });
});


