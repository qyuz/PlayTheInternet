define(function() {
    var extension = {
        startPopupPlayer: startPopupPlayer
    }

    return extension

    function startPopupPlayer() {
        window.addEventListener("unload", function (event) {
            window.chrome.extension.getBackgroundPage().ptiManager.startBackgroundPlayer()
        }, true);
        require(["player/iframe-observer"], function (observer) {
            window.observer = observer //maybe remove this
            observer.init().then(function () {
                window.pti = observer.pti
                window.playerWidget.data.listenObject = window.pti

                var backgroundWindow = chrome.extension.getBackgroundPage()
                backgroundWindow.ptiManager.playingWindow(window)

                var $spinner = $('#spinner-container')
                $spinner.animate({ opacity: 0 }, { duration: 1500, complete: $spinner.remove.bind($spinner) })
            })
        })
    }
})