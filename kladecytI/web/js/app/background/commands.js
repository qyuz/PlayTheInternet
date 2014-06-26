define(["underscore"], function() {
    var actions = {
        "play": function() {
            var pti = _.getPti()
            pti.playVideo()
        },
        "pause": function() {
            var pti = _.getPti()
            pti.pauseVideo()
        },
        "next": function() {
            playlist.playVideo({videoDiv: playlist.lookupNextSong()})
        },
        "prev": function() {
            playlist.playVideo({videoDiv: playlist.lookupPrevSong()})
        },
        "play/pause": function() {
            var pti = _.getPti()
            pti.playing() ? pti.pauseVideo() : pti.playVideo()
        },
        "panel": function() {
            _.openPanel()
        }
    }
    chrome.commands.onCommand.addListener(function(command) {
        actions[command]()
    })
})
