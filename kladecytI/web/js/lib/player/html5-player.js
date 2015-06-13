'use strict';

define(["player/iframe-player", "underscore", "jquery"], function (pti, b, c) {
    var $html5Player, html5Player;

    new pti.Player("w", {
        onPlayerReady: function () {
            var self = this.scope
            self.playProgressCallbacks = $.Callbacks()
            self.temp.playProgress = function () {
//                var pausedDef = new $.Deferred(), timeDef = new $.Deferred(), durationDef = new $.Deferred(), soundIndexDef = new $.Deferred()
//                scWidget.isPaused(function (isPaused) {
//                    pausedDef.resolve(isPaused ? 2 : 1)
//                })
//                scWidget.getPosition(function (position) {
//                    timeDef.resolve(position / 1000)
//                })
//                scWidget.getDuration(function (duration) {
//                    durationDef.resolve(duration / 1000)
//                })
//                scWidget.getCurrentSoundIndex(function (index) {
//                    soundIndexDef.resolve(index)
//                })
//                $.when(pausedDef, timeDef, durationDef, soundIndexDef).then(self.playProgressCallbacks.fire)
            }
        },
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
            $html5Player.attr('src', videoId);
            html5Player.load();
//            scWidget.load(url, { callback: function () {
//                scWidget.skip(0) //because sometimes sc won't start playing
//                self.temp.playProgressInterval = setInterval(self.temp.playProgress, 200)
//            }})
        },
//            onCurrentTime:function (time) {
//            },
        onInitializePlayer: function () {
            var self = this.scope
            $html5Player = $(PTITemplates.prototype.WatchPlayerTemplate());
            $html5Player.appendTo($('#extension-players'));
            html5Player = $html5Player.get(0);
            self.player = html5Player;
//            scWidget.bind(SC.Widget.Events.READY, function () {
//                self.playerReady(1)
//                console.log('playFirstLoaded sc')
//                scWidget.bind(SC.Widget.Events.FINISH, function () {
//                    scWidget.getCurrentSoundIndex(function (data) {
//                        scWidget.getSounds(function (sounds) {
//                            console.log('finished sounds count: ' + sounds.length + ' and current index: ' + data)
//                            if (data == null || data == sounds.length - 1) {
//                                console.log("SC NEXT")
//                                self.playerState(0)
//                            }
//                        })
//                    })
//                });
//            })
//            scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
//                self.temp.blockPlayback && scWidget.pause()
//            })
//            scWidget.bind(SC.Widget.Events.PLAY, function () {
//                pti.nativeRequestPlaying = true
//            })
//            scWidget.bind(SC.Widget.Events.PAUSE, function () {
//                pti.nativeRequestStop = true
//            })
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
            html5Player.volume = volume;
        }
    }, 'extension-players')
    pti.w.initializePlayer();
});

