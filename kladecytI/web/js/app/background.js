define(["pti-playlist", "player/iframe-observer", "app/common/globals"], function(Playlist, observer, c) {
    $(document).ready(function () {
        window.observer = observer
        window.pti = observer.pti
        window.playlist = new Playlist("#ulSecond",
            {
                id:$.jStorage.get('playingId'),
                fillVideoElement:false,
                playerType: true,
                execute: [
                    Playlist.prototype._listenPlayingIdExecute
                ]
            });
        require(["app/background/synchronization", "app/background/commands", "app/background/contextMenus"], function(synchronization) {
            synchronization.init()
        })
    })
})
