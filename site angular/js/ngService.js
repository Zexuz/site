/**
 * Created by isak16 on 2017-03-02.
 */

app.service('requestData', function ($http) {
    this.hotpage = function (type) {
        var counterObj = getLocalStorage("counterObj");
        if(!counterObj) counterObj = {firstRequest: true};
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/hotpage/'+type,
            params: {
                "counterObj": counterObj
            },
            paramSerializer: '$httpParamSerializerJQLike'
        }).then(function successCallback(response) {
            if(type === "both"){
                saveSessionLocalStorage("images", response.data.dataImages.media);
                saveSessionLocalStorage("videos", response.data.dataVideos.media);
                saveCounterObj(response.data.dataImages);
                saveCounterObj(response.data.dataVideos);
            }else{
                saveSessionLocalStorage(type, response.data.media);
                saveCounterObj(response.data);
            }
        }, function errorCallback() {

        }).then(function () {

        });
    };

    this.customSubreddit = function (sources, dataFrom) {
        var sourceData = getLocalStorage(sources);
        var after = "";
        if(sourceData){
            after = sourceData.after;
        }
        $http({
            method: 'GET',
            url: 'https://www.reddit.com/' + dataFrom + '/' + sources + '/hot/.json?after=' + after + '&limit=50'
        }).then(function successCallback(response) {
            var obj = {after: response.data.data.after, data: getMediaOnly(response.data.data.children)};
            saveLocalStorage(sources, obj);
        }, function errorCallback() {
            //error handle
        }).then(function () {

        });
    };

});

