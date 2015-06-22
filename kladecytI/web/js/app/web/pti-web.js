define(["player/play-the-internet", "player/iframe-soundcloud", "player/iframe-vimeo", "jquery", "underscore"], function (playTheInternet) {
    var youtubeDeferred = $.Deferred(), soundcloudDeferred = $.Deferred()

    playTheInternet.init().then(function() {
        debugger;
    });

//     pti.y.options.onAfterPlayerReady = function () {
//         console.log('youtube ready')
//         youtubeDeferred.resolve()
//     }
//     pti.y.options.onAfterPlayerState = function (state) {
//         if (state == 0) {
//             SiteHandlerManager.prototype.stateChange('NEXT')
//         }
//     }

//     pti.options.onAfterError = function (error) {
//         SiteHandlerManager.prototype.stateChange('ERROR')
//     }

//     pti.s.options.onAfterPlayerReady = function () {
//         console.log('soundcloud ready')
//         soundcloudDeferred.resolve()
//     }

//     pti.s.options.onAfterPlayerState = function (state) {
//         if (state == 0) {
//             SiteHandlerManager.prototype.stateChange('NEXT')
//         }
//     }

//     pti.v.options.onAfterPlayerState = function (state) {
//         if (state == 0) {
//             SiteHandlerManager.prototype.stateChange('NEXT')
//         }
//     }

    return { playTheInternet: playTheInternet }
})
