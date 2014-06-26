define(["player/player-widget", "underscore"], function(PlayerWidget) {
    var $window = $(window), backgroundWindow = chrome.extension.getBackgroundPage()
    window.playlist = backgroundWindow.playlist
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
})