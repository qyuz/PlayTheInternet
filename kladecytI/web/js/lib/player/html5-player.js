'use strict';

define(["player/pti-abstract", "underscore", "jquery"], function (PTI, b, c) {
    var html5Player;

    html5Player = new PTI({
        onLoadVideo: function (type, videoId, playerState) {
            $('#extension-players').empty().append(PTITemplates.prototype.WatchPlayerTemplate({ href: videoId }))
        },
        onPlayVideo: function () {
        },
        onPauseVideo: function () {
        },
        onBeforeSeekTo: function (seekTo) {
        },
        onVolume: function (volume) {
        }
    });

    return html5Player;
})

