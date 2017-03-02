/**
 * Created by isak16 on 2017-02-27.
 */
var app = angular.module('app', []);



app.controller('mainflow', function ($scope, $http, $q, requestData) {

    var requestArr = returnAllRequestFuncs(domainSources, requestData);

    $q.all(requestArr
    ).then(function (value) {
        console.log(value);
    }).catch(function (failure) {
        console.log(failure);
    });
});

