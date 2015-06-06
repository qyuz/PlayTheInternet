define(["player/player-widget", "app/common/tabs", "underscore"], function (PlayerWidget, tabs) {
    var backgroundWindow, destroyedPlayer, STATE;

    backgroundWindow = chrome.extension.getBackgroundPage()
    window.parseTheInternet = backgroundWindow.parseTheInternet;
    window.playerWidget = new PlayerWidget('#playerWidgetContainer', true)
    window.playerWidget.data.listenObject = backgroundWindow.ptiManager.pti

    require(["app/popup/parse-content"], function () {
        window.tabs.first.playlist = parsedPlaylist //TODO move it to tabs
    })

    $(document).ready(function () {
        tabs.$firstTabs.tabs("option", "active", 1)
        tabs.$secondTabs.tabs("option", "active", 0)

        $('#tabs a[href="#player"]').one('click', function() {
            require(["player/iframe-observer"], function(observer) {
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
            })
        })

        //hack to make scrollbar disappear
        $('html, body').css('height', '600px')
    })

});