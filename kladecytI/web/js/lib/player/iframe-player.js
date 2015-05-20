define(["player/pti-abstract", "underscore", "jquery"], function (PTI, b, c) {
    var pti = new PTI({
        onLoadVideo:function (type, videoId, playerState) {
            var self = this.scope, previousPlayer = self.players[self.currentPlayer], currentPlayer = self.players[type]
            clearTimeout(self.errorTimeout)
            self.errorTimeout = setTimeout(self.errorCallback, 15000)
            self.currentPlayer = type
            if (previousPlayer) {
                previousPlayer.stopVideo()
                previousPlayer.playProgressCallbacks.remove(pti.playbackController)
                previousPlayer.currentTime(null)
                previousPlayer.soundIndex(null)
                previousPlayer.duration(null)
            }
            if (currentPlayer) {
                self.showPlayer(type)
                self.started = false
                self.startedInit = _.once(function(duration) {
                    self.started = true
                    clearTimeout(self.errorTimeout)
                    //set volume at each video start, then volume is controlled from player-widget and stored in pti
                    currentPlayer.duration(duration)
                    currentPlayer.volume(self.volume())
                })
                //to show correct progress in player-widget when switching from background to popup player
                if(playerState) {
                    self.seekTo(playerState.start)
                    self.data.index = playerState.index ? playerState.index : null
                } else {
                    self.data.seekTo = null
                    self.data.index = null
                }
                currentPlayer.loadVideo(videoId)
                currentPlayer.playProgressCallbacks.add(pti.playbackController)
            } else {
                console.log('no such player')
            }
        },
        onPlayVideo:function () {
            this.scope.playing(true)
        },
        onPauseVideo:function () {
            this.scope.playing(false)
        },
        onBeforeSeekTo:function (seekTo) { //let playbackController seek to avoid twitch and runLifeCycle to set seekTo
            var result, currentTime, duration, skipDirection, skipValue, temp;

            if (_.isString(seekTo) && (seekTo[0] == "+" || seekTo[0] == "-")) {
                temp = this.scope.get(['currentTime', 'duration']);
                currentTime = temp[0];
                duration = temp[1];
                skipDirection = seekTo[0];
                skipValue = parseFloat(seekTo);
                if (_.isNumber(currentTime) && _.isNumber(duration) && !_.isNaN(skipValue)) {
                    result = currentTime + skipValue;
                    if (skipDirection == "+") {
                        if (result >= duration) {
                            result = duration - 1;
                        }
                    } else if (skipDirection == "-") {
                        if (result < 0) {
                            result = 0.01;
                        }
                    }
                }
            } else if (!_.isNaN(parseFloat(seekTo))) {
                result = parseFloat(seekTo);
            }

            result = result > 0 ? [result] : [null];

            return result;
        },
        onVolume:function (volume) {
            var self = this.scope, player = self.players[self.data.currentPlayer]
            _.isUndefined(player) || player.volume(volume)
        }
    })

    //playbackController is responsible for updating progress in player-widget and controlling the flow
    pti.playbackController = function(state, time, duration, index) {
        var currentPlayer = this.players[this.data.currentPlayer], nativeRequestPlaying = this.nativeRequestPlaying, nativeRequestStop = this.nativeRequestStop
        this.nativeRequestPlaying = null
        this.nativeRequestStop = null
        console.log("state: [%s]\r\ntime: [%s]", state, Math.floor(time))

        //can't control player natively before it starts
        if(this.started  && nativeRequestPlaying) {
            this.playing(true)
        }

        //for switch from background to popup in paused state-keep data fresh
        if(this.data.index != null) {
            currentPlayer.soundIndex(this.data.index)
        }
        //check for duration if seekTo was invoked before new playerWidget progress is shown(results in stuck currentTime which is bigger than duration)
        if(this.data.seekTo != null && duration >= this.data.seekTo) {
            currentPlayer.currentTime(this.data.seekTo)
        } else {
            currentPlayer.currentTime(time)
        }
        if(state === 1) {
            //update duration, set volume and other stuff when started
            this.startedInit(duration)
            //listens for player-widget play/pause toggle
            if(!this.playing()) {
                currentPlayer.pauseVideo()
                return
            }
            //listen for player-widget index, seekTo, is a queued action
            if(this.data.index != null) {
                currentPlayer.soundIndex(this.data.index, true)
                this.data.index = null
                return
            } else if(this.data.seekTo != null) {
                this.debounceSeekTo(currentPlayer, this.data.seekTo)
                if(time >= this.data.seekTo) {
                    this.data.seekTo = null
                }
                return
            } else {
                //for soundcloud track change
                currentPlayer.soundIndex(index)
                this.data.currentPlayer === 's' && currentPlayer.volume(this.volume()) //maybe control volume in playbackController(somewhere here)
            }
        }
        //keep invoking iframe-player play, till it starts
        if(!this.started) {
            currentPlayer.playVideo()
            return
        } else {
            //for soundcloud track change
            currentPlayer.duration(duration)
        }
        if(state === 2) {
            //can't control player natively before it starts
            if(this.started && nativeRequestStop) {
                this.playing(false)
                return
            }
            //listen for player-widget play/pause toggle
            if(this.playing()) {
                currentPlayer.playVideo()
                return
            }
        }
    }.bind(pti)

    pti.errorCallback = function() {
        this.error()
    }.bind(pti)

    //soundcloud/yt would twitch without throttle
    pti.debounceSeekTo = _.debounce(function(currentPlayer, seekTo) {
        currentPlayer.seekTo(seekTo)
    }, 300, { leading: true, maxWait: 1000, trailing: false })

    return pti
})

