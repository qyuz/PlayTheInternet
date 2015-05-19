'use strict';

define(["underscore"], function() {
    var actions, backgroundWindow;

    backgroundWindow = window;

    actions = {
        "play": function() {
            var pti = _.getPti();
            pti.playVideo()
        },
        "pause": function() {
            var pti = _.getPti();
            pti.pauseVideo()
        },
        "next": function() {
            playlist.playVideo({videoDiv: playlist.lookupNextSong()});
        },
        "prev": function() {
            playlist.playVideo({videoDiv: playlist.lookupPrevSong()});
        },
        "play/pause": function() {
            var pti = _.getPti();
            pti.playing() ? pti.pauseVideo() : pti.playVideo();
        },
        "panel": function() {
            _.openPanel();
        },
        "skipForward": _.partial(_.get(backgroundWindow, 'ptiManager.pti.seekTo'), '+180'),
        "skipBackward": _.partial(_.get(backgroundWindow, 'ptiManager.pti.seekTo'),'-180')
    };
    chrome.commands.onCommand.addListener(function(command) {
        actions[command]()
    });

});
