'use strict';

define(["underscore"], function() {
    var actions, backgroundWindow;

    backgroundWindow = window;

    actions = {
        "play": function() {
            backgroundWindow.ptiManager.pti.playVideo()
        },
        "pause": function() {
            backgroundWindow.ptiManager.pti.pauseVideo()
        },
        "next": function() {
            playlist.playVideo({videoDiv: playlist.lookupNextSong()});
        },
        "prev": function() {
            playlist.playVideo({videoDiv: playlist.lookupPrevSong()});
        },
        "play/pause": function() {
            if (backgroundWindow.ptiManager.pti.playing()) {
                backgroundWindow.ptiManager.pti.pauseVideo()
            } else {
                backgroundWindow.ptiManager.pti.playVideo()
            }
        },
        "panel": function() {
            _.openPanel();
        },
        "skipForward": _.partial(skip, '+'),
        "skipBackward": _.partial(skip, '-')
    };
    chrome.commands.onCommand.addListener(function(command) {
        actions[command]()
    });

    function skip(skipDirection) {
        backgroundWindow.ptiManager.pti.seekTo(skipDirection + '180')
    }
});
