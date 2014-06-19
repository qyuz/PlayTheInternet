define(["pti-playlist"], function (Playlist) {
    var createPlaylist = _.once(function () {
        window.textParsePlaylist = new Playlist("#textAreaParsePlaylist", {
            playerType: false,
            connectWith: "connected-playlist",
            headerConfigKey: "lConfigTextAreaParsePlaylistHeader",
                    execute: [
                        Playlist.prototype.addAction,
                        function() {
                            this.tabsGetPlaylist = tabs.second.getPlaylist
                        }
                    ]
        })
    })
    $('#tAreaParseButton').click(function () {
        var tAreaText = $('#tArea').val()
        createPlaylist()
        textParsePlaylist._emptyContent();
        require(["cparse"], function () {
                textParsePlaylist.addElements(_.stringToArray(playTheInternetParse(tAreaText)), true)
        })
    })
})