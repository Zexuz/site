/**
 * Created by isak16 on 2017-02-27.
 */
var app = angular.module('app', []);



app.controller('mainflow', function ($scope, $rootScope, $http, $q, requestData) {

    $scope.dataArr = [];

    $rootScope.displayData = function(){
        var dataArrsDom = [];
        var dataArrsSub = [];
        for(var i = 0; i < sourceObj.domains.length; i++){
            var tempData = getLocalStorage(sourceObj.domains[i]);
            if(tempData){
                dataArrsDom = dataArrsDom.concat(getMediaFromLocalStorage(sourceObj.domains[i], displayAmount, tempData));
            }
        }

        for(var p = 0; p < sourceObj.subreddits.length; p++){
            var tempData1 = getLocalStorage(sourceObj.subreddits[p]);
            if(tempData1){
                dataArrsSub = dataArrsSub.concat(getMediaFromLocalStorage(sourceObj.subreddits[p], displayAmount, tempData1));
            }
        }

        dataArrsDom = dataArrsDom.concat(dataArrsSub);
        $scope.dataArr = dataArrsDom;
    };

    $scope.getData = function(){
        executeAllReq(requestData);
        $rootScope.displayData();
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

    $scope.getData();
});


