/**
 * Created by isak16 on 2017-02-27.
 */
var app = angular.module('app', []);



app.controller('mainflow', function ($scope, $rootScope, $http, $q, requestData) {

    $scope.dataArr = [];

    $scope.displayData = function(){
        var multibleDataArrays = [];
        var singeArrayOfAllData = [];


        for(var i = 0; i < sourceObj.domains.length; i++){
            multibleDataArrays.push(getMediaFromLocalStorage(sourceObj.domains[i], displayAmount));
        }
        multibleDataArrays.push(getMediaFromLocalStorage("subbredditsData", displayAmount));
        multibleDataArrays.push(getMediaFromLocalStorage("image", displayAmount));
        multibleDataArrays.push(getMediaFromLocalStorage("video", displayAmount));


        for(var p = 0; p < multibleDataArrays.length; p++) {
            singeArrayOfAllData = singeArrayOfAllData.concat(multibleDataArrays[p]);
        }

        $scope.dataArr = singeArrayOfAllData;

    };

    $scope.getData = function(){
        var requestArr = returnAllRequestFuncs(domainSources, requestData);

        $q.all(requestArr
        ).then(function () {
                $scope.displayData();
        }).catch(function (failure) {
            console.log(failure);
        });
    };

    $scope.getData();

    $scope.$watch('[imagesBool, videosBool]', function () {
        var tempObj = setImagesVideosBool(counter, $scope.imagesBool, $scope.videosBool);
        saveLocalStorage("counter", tempObj);
    }, true);
});


