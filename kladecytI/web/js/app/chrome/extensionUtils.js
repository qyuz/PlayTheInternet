"use strict";
define(function () {
    var extensionUtils;

    extensionUtils = {
        startPopupPlayer: startPopupPlayer
    };

    return extensionUtils;

    function startPopupPlayer() {
        var backgroundWindow, $spinner;

        backgroundWindow = window.chrome.extension.getBackgroundPage();

        window.addEventListener("unload", function () {
            backgroundWindow.ptiManager.startBackgroundPlayer();
        }, true);
        require(["player/iframe-observer"], function (observer) {
            window.observer = observer; //maybe remove this
            observer.init().then(function () {
                window.pti = observer.pti;
                window.playerWidget.data.listenObject = window.pti;

                backgroundWindow.ptiManager.playingWindow(window);

                $spinner = $('#spinner-container');
                $spinner.animate({ opacity: 0 }, { duration: 1500, complete: $spinner.remove.bind($spinner) });
            })
        })
    }
});
