app.directive('youtube', function () {
    return {
        controller: "youtubeController",
        templateUrl: './partial/media/youtube.html'
    };
});
app.directive('imagemedia', function () {
    return {
        templateUrl: './partial/media/image.html'
    };
});

app.directive('twitch', function () {
    return {
        controller: "twitchController",
        templateUrl: './partial/media/twitch.html'
    };
});

app.directive('gfycat', function () {
    return {
        controller: "gfycatController",
        templateUrl: './partial/media/gfycat.html'
    };
});


