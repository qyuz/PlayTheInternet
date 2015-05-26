define(["player/pti-abstract", "player/iframe-wrapper", "jquery", "underscore", "jstorage"], function (PTI, IframeWrapper, c, d, e) {
    var iframeContainer, iframeObserver, initAndListenThrottle, iw, pti;
    var host = "0-71.playtheinternet.appspot.com"
//        var host = "playtheinternet.appspot.com"
//        var host = "web.playtheinter.net"
    var lastReady = 0, reinitInterval = 120 * 60000, initTimeout = 30000
    var observerReady = new $.Deferred(), youtubeReady, soundcloudReady

    iframeContainer = $('#players')
    pti = initPTI()
    initAndListenThrottle = _.throttle(initAndListen, initTimeout, { trailing: false })

    iframeObserver = {
        destroy: removeIframe,
        init: init,
        pti: pti,
        reinit: reinit,
        startPlayer: startPlayer
    };

    return iframeObserver;

    function appendIframe() {
        var playerIframe

        youtubeReady = new $.Deferred()
        soundcloudReady = new $.Deferred()

        iframeContainer.html('<iframe class="leftFull temp-border-none temp-width-hundred-percent" src="http://' + host + '/iframe-player.html?origin=' + window.location.href + '"></iframe>')
        playerIframe = iframeContainer.find('iframe').get(0).contentWindow

        return playerIframe
    }

    function initAndListen() {
        init()
        clearTimeout(initFailTimeout)
        var initFailTimeout = setTimeout(function () {
            console.log('failed to init players in observer, retrying')
            initAndListenThrottle()
        }, initTimeout + 500)
        $.when(youtubeReady, soundcloudReady).then(function () {
            clearTimeout(initFailTimeout)
            pti.playing(pti.playing())
            var volume = $.jStorage.get('volume')
            pti.volume(volume)
            var loadVideo = pti.loadVideo()
            iw.postMessage('pti', 'loadVideo', loadVideo[0], loadVideo[1], loadVideo[2])
            lastReady = Date.now()
            observerReady.resolve()
        })
    }

    function lazyLoadVideo(thistype, thisoperation, type, videoId, playerState) {
        if (Date.now() - lastReady >= reinitInterval) {
            initAndListenThrottle()
        } else {
            iw.postMessage(thistype, thisoperation, type, videoId, playerState)
        }
    }

    function initPTI() {
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

    function init() {
        if(observerReady.state() == "pending") {
            appendIframe()
            iw = initIframeWrapper()
            initAndListenThrottle()
        } else {
            reinit()
        }
        return observerReady
    }

    function initIframeWrapper() {
        var playerIframe, iw

        playerIframe = appendIframe()
        iw = new IframeWrapper(playerIframe, ["http://" + host])

        iw.listenAllEvents(pti.players)

        return iw;
    }

    function removeIframe() {
        iframeContainer.find('iframe').attr('src', null)
        iframeContainer.empty()
        iw.iframe = null
    }

    function reinit() {
        var playerIframe

        removeIframe()
        playerIframe = appendIframe()
        iw.iframe = playerIframe
    }

    function startPlayer() {
        var backgroundWindow, $spinner;

        backgroundWindow = window.chrome.extension.getBackgroundPage();

        window.addEventListener("unload", function () {
            backgroundWindow.ptiManager.startBackgroundPlayer();
        }, true);
        window.observer = iframeObserver; //maybe remove this
        iframeObserver.init().then(function () {
            window.pti = pti;
            window.playerWidget.data.listenObject = window.pti;

            backgroundWindow.ptiManager.playingWindow(window);

            $spinner = $('#spinner-container');
            $spinner.animate({ opacity: 0 }, { duration: 1500, complete: $spinner.remove.bind($spinner) });
        })
    }
})
