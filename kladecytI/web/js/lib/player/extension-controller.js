'use strict';

define(["player/iframe-observer", "player/extension-players"], function(observer, extensionPlayers) {
    var backgroundWindow, destroyedPlayer, STATE;

    backgroundWindow = chrome.extension.getBackgroundPage();

    STATE = observer.STATE;
    window.observer = observer;
    window.pti = observer.pti;
    backgroundWindow.ptiManager.playingWindow(window);
    observer.listen(function(action) {
        if (action == STATE.DESTROY) {
            destroyedPlayer = true;
        } else if (action == STATE.PLAY && destroyedPlayer) {
            backgroundWindow.ptiManager.playingWindow(window);
        }
    });
});
