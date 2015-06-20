define(["player/iframe-player", "player/iframe-soundcloud", "player/iframe-vimeo", "jquery", "underscore"], function (pti) {
    var youtubeDeferred = $.Deferred(), soundcloudDeferred = $.Deferred()

    pti.y.options.onAfterPlayerReady = function () {
        console.log('youtube ready')
        youtubeDeferred.resolve()
    }
    pti.y.options.onAfterPlayerState = function (state) {
        if (state == 0) {
            SiteHandlerManager.prototype.stateChange('NEXT')
        }
    }

    pti.options.onAfterError = function (error) {
        SiteHandlerManager.prototype.stateChange('ERROR')
    }

    pti.s.options.onAfterPlayerReady = function () {
        console.log('soundcloud ready')
        soundcloudDeferred.resolve()
    }

    pti.s.options.onAfterPlayerState = function (state) {
        if (state == 0) {
            SiteHandlerManager.prototype.stateChange('NEXT')
        }
    }

    pti.v.options.onAfterPlayerState = function (state) {
        if (state == 0) {
            SiteHandlerManager.prototype.stateChange('NEXT')
        }
    }

    return { pti: pti, youtubeReady: youtubeDeferred, soundcloudReady: soundcloudDeferred }
})
