define(["player/iframe-player", "player/html5-player", "jquery", "underscore"], function (pti, b) {
    var html5PlayerDeferred

    pti.w.options.onAfterPlayerReady = function () {
        console.log('youtube ready')
    }
    pti.w.options.onAfterPlayerState = function (state) {
        if (state == 0) {
            SiteHandlerManager.prototype.stateChange('NEXT')
        }
    }

    pti.options.onAfterError = function (error) {
        SiteHandlerManager.prototype.stateChange('ERROR')
    }

    return { pti: pti, html5PlayerDeferred: html5PlayerDeferred }
});
