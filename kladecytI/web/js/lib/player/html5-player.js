'use strict';

define(["player/iframe-player", "underscore", "jquery"], function (pti, b, c) {
    var $html5Player, html5Player;

    new pti.Player("w", {
//        onPlayerReady: function () {
//        },
//            onPlayerState:function (state) {
//            },
//            onError:function (error) {
//            },
        onStopVideo: function () {
            this.scope.temp.blockPlayback = true;
            this.scope.clearTimeout();
            html5Player.pause();
        },
        onLoadVideo: function (videoId) {
            var self = this.scope;
            self.temp.blockPlayback = false;
            html5Player.src = videoId;
            html5Player.load();
            self.temp.playProgressInterval = setInterval(self.temp.playProgress, 200);
        },
//            onCurrentTime:function (time) {
//            },
        onInitializePlayer: function () {
            $html5Player = $(PTITemplates.prototype.WatchPlayerTemplate());
            $html5Player.appendTo($('#extension-players'));
            html5Player = $html5Player.get(0);

            var self = this.scope;
            self.player = html5Player;
            self.playProgressCallbacks = $.Callbacks();
            self.temp.playProgress = function() {
                var state, currentTime, duration;

                state = html5Player.paused ? 2 : 1;
                currentTime = html5Player.currentTime;
                duration = html5Player.duration;

                self.playProgressCallbacks.fire(state, currentTime, duration)
            };
            html5Player.addEventListener("ended", function(evt) {
                console.log(evt);
                self.playerState(0);
            });
        },
        onClearTimeout: function () {
            var self = this.scope;
            clearInterval(self.temp.playProgressInterval);
        },
        onPlayVideo: function () {
            html5Player.play();
        },
        onPauseVideo: function () {
            html5Player.pause();
        },
        onSeekTo: function (seekTo) {
            html5Player.currentTime = seekTo;
        },
        onVolume: function (volume) {
            try {
                html5Player.volume = volume;
            } catch(e) {}
        }
    }, 'extension-players')
    pti.w.initializePlayer();
});

