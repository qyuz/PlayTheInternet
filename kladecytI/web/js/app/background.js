define(["pti-playlist", "iframe-observer"], function(Playlist, observer) {
    $(document).ready(function () {
        window.observer = observer
        window.pti = observer.pti
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                fillVideoElement:false,
                playerType: true
            });
        require(["app/background/synchronization", "app/background/commands", "app/background/contextMenus"], function(synchronization) {
            synchronization.init()
        })
    })
})
