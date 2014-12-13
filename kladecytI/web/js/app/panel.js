define(["player/player-widget", "underscore"], function(PlayerWidget) {
    var setWindowTitle = _.setWindowTitle.bind(window)
    chrome.windows.getAll(function (windows) {
        if(_.findWhere(windows, { type: 'panel' })) {
            var $window = $(window), backgroundWindow = chrome.extension.getBackgroundPage()
            window.playlist = backgroundWindow.playlist
            window.playlist.on('selected', setWindowTitle)
            window.addEventListener("unload", _.bind(window.playlist._callbacksRemove, window.playlist, 'selected', setWindowTitle), true);
            window.playerWidget = new PlayerWidget('#playerWidgetContainer', true)
            window.playerWidget.data.listenObject = _.getPti()
            window.ptiInterval = setInterval(function() {
                window.playerWidget.data.listenObject = _.getPti()
            }, 300)
            function resizePlayer() {
                window.playerWidget.jProgressBarContainer.width($window.width() - 4)
                window.playerWidget.jVolume.width($window.width() - 106)
            }
            $window.resize(_.debounce(resizePlayer, 50))
            resizePlayer()
        } else {
            window.resizeTo(410, 136)
            $('body').on('click', 'a', function() {
                chrome.windows.create({
                    url: 'chrome://flags/#enable-panels',
                    width: 800,
                    height: 600
                })
            })
            $('body').html('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-error"><b>Panel is an experimental feature which should be<br>enabled first.</b><br><a href="chrome://flags/#enable-panels" target="_blank">Follow this link to enable panels and then click<br>"Relaunch Now" to restart Chrome.</a></div> </div> </div> </div>')
        }
    })
})