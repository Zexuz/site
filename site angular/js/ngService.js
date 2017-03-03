/**
 * Created by isak16 on 2017-03-02.
 */

app.service('requestData', function ($http, $q) {
    this.hotpage = function (type) {


        var q = $q.defer();
        var tempCounter = getCountersFromType(type, counter);
        console.log(tempCounter);

        if (!counter.types[type]) {
            return [];
        }

        return $http({
            method: 'GET',
            url: 'http://localhost:3000/api/hotpage?sort=-upvotes&type=' + type + '&limit=' + limit + '&skip=' + tempCounter.requestSkip + '&timestamp__lte=' + timestamp
        }).then(function successCallback(response) {
            saveLocalStorage("counter", returnCounterObj(tempCounter.imageCounter, tempCounter.videoCounter, counter.timestamp, counter.types.image, counter.types.video));
            saveLocalStorage(type, response);
            q.resolve(response.data);
        }, function errorCallback() {
            q.reject('Failed loading data from hotpage');
        }).then(function () {
            return q.promise;
        });
    };

    this.customSubreddit = function (sources, dataFrom) {
        console.log(sources);
        var q = $q.defer();
        var source = getLocalStorage(sources);

        if(dataFrom === "r"){
            source = getLocalStorage("subbredditsData");
        }

        var after = "";
        if(source){
            after = source.after;
        }

        return $http({
            method: 'GET',
            url: 'https://www.reddit.com/' + dataFrom + '/' + returnSourcesInString(sources, dataFrom) + '/hot/.json?after=' + after + '&limit=50'
        }).then(function successCallback(response) {
            q.resolve(getMediaOnly(response.data.data.children));
            var obj = {after: response.data.data.after, data: getMediaOnly(response.data.data.children)};
            if(dataFrom === "r"){
                sources = "subbredditsData";
            }
            saveLocalStorage(sources, obj);
        }, function errorCallback() {
            q.reject('Failed loading data from reddit');
        }).then(function () {
            return q.promise;
        });
    };

});

