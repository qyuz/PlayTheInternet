define(["app/common/tabs", "app/common/globals", "app/web/pti-web"], function (tabs, b, ptiWeb) {
    window.pti = ptiWeb.pti
    ptiWeb.pti.volume($.jStorage.get('volume'))
    $(document).ready(function () {
        require(["player/player-widget"], function (PlayerWidget) {
            window.playerWidget = new PlayerWidget('#playerWidgetContainer', true)
            window.playerWidget.data.listenObject = ptiWeb.pti
        })

        tabs.$firstTabs.tabs("option", "active", 0)
        tabs.$secondTabs.tabs("option", 'active', 0)
        tabs.playingReady.then(function() {
            window.playlist.addElements(window.location.hash.replace("#", "").split(","), true)
            window.playlist.on('selected', _.setWindowTitle)
        })
        $.when(tabs.playingReady, ptiWeb.youtubeReady, ptiWeb.soundcloudReady).then(function() {
            var currVideo = window.playlist.getSelectedVideoDiv()
            currVideo = currVideo ? currVideo : window.playlist.lookupNextSong()
            window.playlist.playVideo({videoDiv:currVideo})
        })
    })
})