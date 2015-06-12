'use strict';

define(["player/pti-abstract", "underscore", "jquery"], function (PTI, b, c) {
    var html5Player;

    html5Player = new PTI({
        onLoadVideo: function (type, videoId, playerState) {
            html5Player.$player.attr('src', videoId);
            html5Player.player.load();
        },
        onPlayVideo: function () {
            html5Player.player.play();
        },
        onPauseVideo: function () {
            html5Player.player.pause();
        },
        onSeekTo: function (seekTo) {
            html5Player.player.currentTime = seekTo;
        },
        onVolume: function (volume) {
            html5Player.player.volume = volume;
        }
    });

    initializePlayer();

    return html5Player;

    function initializePlayer() {
        html5Player.$player = $(PTITemplates.prototype.WatchPlayerTemplate());
        html5Player.$player.appendTo($('#extension-players'));
        html5Player.player = html5Player.$player.get(0);
    }
});
