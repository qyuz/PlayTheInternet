define(["player/iframe-player", "player/html5-player", "jquery", "underscore"], function (pti, b) {
    pti.w.options.onAfterPlayerState = function (state) {
        if (state == 0) {
            SiteHandlerManager.prototype.stateChange('NEXT')
        }
    }

    pti.options.onAfterError = function (error) {
        SiteHandlerManager.prototype.stateChange('ERROR')
    }

    return { pti: pti }
});
