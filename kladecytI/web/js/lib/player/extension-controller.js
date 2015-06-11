'use strict';

define(["player/pti-abstract", "player/iframe-observer", "player/html5-player"], function(PTI, observer, html5Player) {
    var backgroundWindow, iframePti, extensionPti, destroyedPlayer, STATE;

    backgroundWindow = chrome.extension.getBackgroundPage();

    STATE = observer.STATE;
    iframePti = observer.pti;
    extensionPti = html5Player;
    window.observer = observer;
    window.pti = ExtensionController();
    backgroundWindow.ptiManager.playingWindow(window);
    observer.listen(function(action) {
        if (action == STATE.DESTROY) {
            destroyedPlayer = true;
        } else if (action == STATE.PLAY && destroyedPlayer) {
            backgroundWindow.ptiManager.playingWindow(window);
        }
    });

    function ExtensionController() {
        var extensionController;

        extensionController = new PTI({
            onLoadVideo: function (type, videoId, playerState) {
                $('#iframe-players').toggleClass('temp-absolute-off-screen', type == "w");
                $('#extension-players').toggleClass('temp-absolute-off-screen', type != "w");
                if (type == "w") {
                    extensionPti.loadVideo.apply(extensionController, arguments);
                } else {
                    iframePti.loadVideo.apply(extensionController, arguments);
                }
            },
            onPlayVideo: function () {
            },
            onPauseVideo: function () {
            },
            onSeekTo: function (seekTo) {
            },
            onVolume: function (volume) {
            }
        });

        return extensionController;
    }
});
