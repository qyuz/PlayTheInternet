define(["player/iframe-player", "soundcloud-api", "jquery", "underscore", "ctemplates"], function (pti, scapi, c, d) {
        new pti.Player("s", {
            playerTemplate:PTITemplates.prototype.SoundCloudPlayerTemplate,
            onPlayerReady:function () {
                var self = this.scope
                self.playProgressCallbacks = $.Callbacks()
                self.temp.playProgress = function() {
                    var pausedDef = new $.Deferred(), timeDef = new $.Deferred(), durationDef = new $.Deferred(), soundIndexDef = new $.Deferred()
                    scWidget.isPaused(function (isPaused) {
                        pausedDef.resolve(isPaused ? 2 : 1)
                    })
                    scWidget.getPosition(function (position) {
                        timeDef.resolve(position / 1000)
                    })
                    scWidget.getDuration(function (duration) {
                        durationDef.resolve(duration / 1000)
                    })
                    scWidget.getCurrentSoundIndex(function (index) {
                        soundIndexDef.resolve(index)
                    })
                    $.when(pausedDef, timeDef, durationDef, soundIndexDef).then(self.playProgressCallbacks.fire)
                }
            },
//            onPlayerState:function (state) {
//            },
//            onError:function (error) {
//            },
            onStopVideo:function () {
                this.scope.temp.blockPlayback = true
                this.scope.clearTimeout()
                scWidget.pause()
            },
            onLoadVideo:function (videoId) {
                var self = this.scope
                self.temp.blockPlayback = false
                var playerUrl = 'https://w.soundcloud.com/player/?url='
                var id = videoId.replace(/^\/?(.*)/, '/$1').replace(/\\/g, '')
                var url = playerUrl + id
                scWidget.load(url, { callback: function () {
                    scWidget.skip(0) //because sometimes sc won't start playing
                    self.temp.playProgressInterval = setInterval(self.temp.playProgress, 200)
                }})
            },
//            onCurrentTime:function (time) {
//            },
            onInitializePlayer:function () {
                var self = this.scope
                $('#soundCloud').append(self.options.playerTemplate())
                var scWidgetIframe = document.getElementById('sc-widget');
                window.scWidget = SC.Widget(scWidgetIframe);

                scWidget.bind(SC.Widget.Events.READY, function () {
                    self.playerReady(1)
                    console.log('playFirstLoaded sc')
                    scWidget.bind(SC.Widget.Events.FINISH, function () {
                        scWidget.getCurrentSoundIndex(function (data) {
                            scWidget.getSounds(function (sounds) {
                                console.log('finished sounds count: ' + sounds.length + ' and current index: ' + data)
                                if (data == null || data == sounds.length - 1) {
                                    console.log("SC NEXT")
                                    self.playerState(0)
                                }
                            })
                        })
                    });
                })
                scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, function() {
                    self.temp.blockPlayback && scWidget.pause()
                })
                scWidget.bind(SC.Widget.Events.PLAY, function() {
                        pti.nativeRequestPlaying = true
                })
                scWidget.bind(SC.Widget.Events.PAUSE, function() {
                        pti.nativeRequestStop = true
                })
            },
            onClearTimeout:function () {
                var self = this.scope
                clearInterval(self.temp.playProgressInterval)
            },
            onPlayVideo:function () {
                scWidget.play()
            },
            onPauseVideo:function () {
                scWidget.pause()
            },
            onSeekTo:function (seekTo) {
                scWidget.seekTo(seekTo * 1000)
            },
            onVolume:function (volume) {
                _.isUndefined(volume) || scWidget.setVolume(volume)
            },
            onSoundIndex: function (index, invoke) {
                invoke && scWidget.skip(index)
            }
        }, 'soundCloudContainer')
        pti.s.initializePlayer()
    }
)
