/**
 * Created by isak16 on 2017-02-27.
 */
var app = angular.module('app', []);



app.controller('mainflow', function ($scope, $rootScope, $http, $q, requestData) {

    $scope.dataArr = [];

    $scope.displayData = function(){
        var tempArr = [];

        for(var i = 0; i < sourceObj.domains.length; i++){
           tempArr.push(getMediaFromLocalStorage(sourceObj.domains[i], displayAmount));
        }
        tempArr.push(getMediaFromLocalStorage("subbredditsData", displayAmount));
        tempArr.push(getMediaFromLocalStorage("image", displayAmount));
        tempArr.push(getMediaFromLocalStorage("video", displayAmount));
        $scope.dataArr = tempArr;

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
        var tempObj = setImagesVideosBool(counter, $scope.imagesBool, $scope.videosBool)
        saveLocalStorage("counter", tempObj);
    }, true);
});


