define(["player/pti-abstract", "player/iframe-wrapper", "jquery", "underscore", "jstorage"], function (PTI, IframeWrapper, c, d, e) {
    var iframeContainer, iframeObserver, initAndListenThrottle, iw, pti, state;
    var host = "0-71.playtheinternet.appspot.com"
//        var host = "playtheinternet.appspot.com"
//        var host = "web.playtheinter.net"
    var observerReady, youtubeReady, soundcloudReady, lastReady, reinitInterval, initTimeout;

    lastReady = 0;
    reinitInterval = 120 * 60000;
    initTimeout = 30000;
    iframeContainer = $('#players')
    pti = _definePTI()
    initAndListenThrottle = _.throttle(initAndListen, initTimeout, { trailing: false })

    iframeObserver = {
        destroy: destroy,
        init: init,
        pti: pti,
        reinit: reinit,
        startPlayer: startPlayer
    };

    return iframeObserver;

    function _appendIframe() {
        var playerIframe

        observerReady = $.Deferred();
        youtubeReady = $.Deferred();
        soundcloudReady = $.Deferred();
        iframeContainer.html('<iframe class="leftFull temp-border-none temp-width-hundred-percent" src="http://' + host + '/iframe-player.html?origin=' + window.location.href + '"></iframe>')
        playerIframe = iframeContainer.find('iframe').get(0).contentWindow

        return playerIframe
    }

    function _definePTI() {
        var pti = new PTI({
            onLoadVideo: function (type, videoId, playerState) {
                !_.isUndefined(type) && !_.isUndefined(videoId) && lazyLoadVideo(this.type, this.operation, type, videoId, playerState)
            },
            onPlaying: function (boolean) {
                if (boolean && this.scope.data.playing == null) {
                    this.scope.data.playing = true
                    var _state = {
                        selectedVideoIndex: window.playlist.getSelectedVideoIndex(),
                        playing: true,
                        volume: $.jStorage.get('volume')
                    }
                    _state.selectedVideoIndex = _state.selectedVideoIndex >= 0 ? _state.selectedVideoIndex : 0
                    window.playlist.playVideo({ index: _state.selectedVideoIndex }, _state.playerState)
                    this.scope.volume(_state.volume)
                } else {
                    arguments[3] !== 'iframe-wrapper' && iw && iw.postMessage(this.type, this.operation, boolean)
                }
            },
            onPlayVideo: function () {
                iw.postMessage(this.type, this.operation)
            },
            onPauseVideo: function () {
                iw.postMessage(this.type, this.operation)
            },
            onSeekTo: function (seekTo) {
                iw.postMessage(this.type, this.operation, seekTo)
            },
            onVolume: function (volume) {
                iw.postMessage(this.type, this.operation, volume)
            },
            onError: function () {
                SiteHandlerManager.prototype.stateChange('ERROR')
            }
        })

        new pti.Player('y', {
            onLoadVideo: function (videoObject) {
                iw.postMessage(this.type, this.operation, videoObject)
            },
            onStopVideo: function () {
                iw.postMessage(this.type, this.operation)
            },
            onCurrentTime: function (time) {
            },
            onPlayerState: function (state) {
                if (state == 0) {
                    SiteHandlerManager.prototype.stateChange('NEXT')
                }
            },
            onPlayerReady: function (playerState) {
                youtubeReady.resolve()
            }
        })
        new pti.Player('s', {
            onLoadVideo: function (videoId) {
                iw.postMessage(this.type, this.operation, videoId)
            },
            onInitializePlayer: function () {
                iw.postMessage(this.type, this.operation)
            },
            onCurrentTime: function (time) {
//        console.log('from main')
//        console.log(time)
            },
            onPlayerState: function (state) {
                if (state == 0) {
                    SiteHandlerManager.prototype.stateChange('NEXT')
                }
            },
            onPlayerReady: function (playerState) {
                soundcloudReady.resolve()
            }
        })
        new pti.Player('v', {
            onLoadVideo: function (videoId) {
                iw.postMessage(this.type, this.operation, videoId)
            },
            onCurrentTime: function (time) {
//        console.log('from main')
//        console.log(time)
            },
            onPlayerState: function (state) {
                if (state == 0) {
                    SiteHandlerManager.prototype.stateChange('NEXT')
                }
            }
        })
        return pti
    }

    function _events() {
        window.addEventListener("unload", function () {
            if(_state() == 'loading' || _state() == 'playing') {
                window.chrome.extension.getBackgroundPage().ptiManager.startBackgroundPlayer();
            }
        }, true);
        $('#playersContainer').on('click', '#parsedError', function() {
            startPlayer();
        })
    }

    function _defineIframeWrapper(playerIframe) {
        var iw

        iw = new IframeWrapper(playerIframe, ["http://" + host])
        iw.listenAllEvents(pti.players)

        return iw;
    }

    function _state(_state) {
        if(arguments.length) {
            state = _state;
            $('#playersContainer').toggleClass('destroyed', _state == 'destroyed');
            $('#playersContainer').toggleClass('playing', _state == 'playing');
            $('#playersContainer').toggleClass('loading', _state == 'loading');
        }

        return state;
    }

    function _removeIframe() {
        observerReady.reject();
        youtubeReady.reject();
        soundcloudReady.reject();
        iframeContainer.find('iframe').attr('src', null)
        iframeContainer.empty()
        iw.iframe = null
    }


    function destroy() {
        lastReady = 0;

        _removeIframe();
        _state('destroyed');
    }

    function initAndListen() {
        clearTimeout(initFailTimeout)
        var initFailTimeout = setTimeout(function () {
            console.log('failed to init players in observer, retrying')
            initAndListenThrottle()
        }, initTimeout + 500)
        $.when(youtubeReady, soundcloudReady).then(function () {
            clearTimeout(initFailTimeout)
            lastReady = Date.now()
            observerReady.resolve()
            state('playing');
        })
    }

    function lazyLoadVideo(thistype, thisoperation, type, videoId, playerState) {
        if (Date.now() - lastReady >= reinitInterval) {
            initAndListenThrottle()
        } else {
            iw.postMessage(thistype, thisoperation, type, videoId, playerState)
        }
    }

    function init() {
        var playerIframe;

        if(_state() == undefined || _state() == 'destroyed') {
            playerIframe = _appendIframe();
            if(_state() == undefined) {
			    _events();
                iw = _defineIframeWrapper(playerIframe);
            } else {
                iw.iframe = playerIframe;
            }
            initAndListenThrottle()
        }

        return observerReady
    }

    function reinit() {
        var playerIframe

        _removeIframe()
        playerIframe = _appendIframe()
        iw.iframe = playerIframe
    }

    function startPlayer() {
        window.observer = iframeObserver; //maybe remove this
        iframeObserver.init().then(function () {
            window.pti = pti;
            window.playerWidget.data.listenObject = window.pti;

            window.chrome.extension.getBackgroundPage().ptiManager.playingWindow(window);
            _state('playing');
        })
        _state('loading');
    }
})
