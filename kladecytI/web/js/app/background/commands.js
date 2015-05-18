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
        "skipForward": _.partial(skip, "forward"),
        "skipBackward": _.partial(skip, "backward")
    };
    chrome.commands.onCommand.addListener(function(command) {
        actions[command]()
    });

    function skip(direction) {
        var pti, calculatedTime, currentTime, duration, temp;

        pti = backgroundWindow.ptiManager.pti;
        if (pti) {
            temp = pti.get(['currentTime', 'duration']);
            currentTime = temp[0];
            duration = temp[1];
            if (_.isNumber(currentTime) && _.isNumber(duration)) {
                if (direction == "forward") {
                    calculatedTime = currentTime + 180;
                    if (calculatedTime >= duration) {
                        calculatedTime = duration - 1;
                    }
                } else {
                    calculatedTime = currentTime - 180;
                    if (calculatedTime < 0) {
                        calculatedTime = 0.01;
                    }
                }
                pti.seekTo(calculatedTime);
            }
        }
    }
});
