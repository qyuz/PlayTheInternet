'use strict';

define(["player/pti-abstract", "player/iframe-observer", "player/play-the-extension"], function(PTI, observer, playTheExtension) {
    var backgroundWindow, iframePti, extensionPti, destroyedPlayer, STATE;

    backgroundWindow = chrome.extension.getBackgroundPage();

    STATE = observer.STATE;
    iframePti = observer.pti;
    extensionPti = playTheExtension.pti;
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
                if (arguments.length) {
                    $('#iframe-players').toggleClass('temp-absolute-off-screen', type == "w");
                    $('#extension-players').toggleClass('temp-absolute-off-screen', type != "w");
                    if (type == "w") {
                        extensionController.pti = extensionPti;
                    } else {
                        extensionController.pti = iframePti;
                    }
                    extensionController.pti.loadVideo.apply(extensionController, arguments);
                }
            },
            onPlayVideo: function () {
                extensionController.pti.playVideo.apply(extensionController, arguments);
            },
            onPauseVideo: function () {
                extensionController.pti.pauseVideo.apply(extensionController, arguments);
            },
            onSeekTo: function (seekTo) {
                if (arguments.length) {
                    extensionController.pti.seekTo.apply(extensionController, arguments);
                }
            },
            onVolume: function (volume) {
                if (arguments.length) {
                    extensionController.pti.volume.apply(extensionController, arguments);
                }
            }
        });
//       extensionController.get = function() {
//           return extensionController.pti.get.apply(extensionController.pti, arguments);
//       };

        return extensionController;
    }
});
