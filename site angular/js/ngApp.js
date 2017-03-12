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



    $scope.getData = function(){
        executeAllReq(requestData, function () {
            $scope.displayData();
        });
    };

    $scope.addSrc = function () {
        console.log($scope.input);
    };

    $scope.displayData = function(){
        var dataArrsDom = [];
        var dataArrsSub = [];
        var amountEachSubb = Math.ceil((displayAmount/(sourceObj.subreddits.length + sourceObj.domains.length)));


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

        angular.forEach(sourceObj.subreddits, function (value) {
            var tempData1 = getLocalStorage(value);
            if(tempData1){
                dataArrsSub = dataArrsSub.concat(getMediaFromLocalStorage(value, amountEachSubb, tempData1));
            }
        });

        angular.forEach(sourceObj.domains, function (value) {
            var tempData = getLocalStorage(value);
            if(tempData){
                dataArrsDom = dataArrsDom.concat(getMediaFromLocalStorage(value, amountEachSubb, tempData));
            }
        });

        dataArrsDom = dataArrsDom.concat(dataArrsSub);

        $scope.dataArr = dataArrsDom;
    };

    $scope.$watch('[imagesBool, videosBool]', function (newVal) {
        var tempObj = getLocalStorage("typeBools");

        if(tempObj && typeof newVal[0] !== 'undefined'){
            tempObj = {
                imagesBool: newVal[0],
                videosBool: newVal[1]
            };
            $scope.imagesBool = newVal[0];
            $scope.videosBool = newVal[1];
            saveLocalStorage("typeBools", tempObj);
        }else if(tempObj){
            $scope.imagesBool = tempObj.imagesBool;
            $scope.videosBool = tempObj.videosBool;
            saveLocalStorage("typeBools", tempObj);
        }else{
            tempObj = {
                imagesBool: true,
                videosBool: true
            };
            $scope.imagesBool = tempObj.imagesBool;
            $scope.videosBool = tempObj.videosBool;
            saveLocalStorage("typeBools", tempObj);
        }
    }, true);

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