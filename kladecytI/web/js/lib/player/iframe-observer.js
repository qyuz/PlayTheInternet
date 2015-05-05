'use strict';

define(["player/pti-abstract", "player/iframe-wrapper", "jquery", "underscore", "jstorage"], function (PTI, IframeWrapper, c, d, e) {
    var iframeContainer, iframeObserver, initAndListenThrottle, iw, pti, state, options;
    var host = "0-71.playtheinternet.appspot.com"
//        var host = "playtheinternet.appspot.com"
//        var host = "web.playtheinter.net"
    var observerReady, youtubeReady, soundcloudReady, callbacks;
    var STATE = {
        DESTROY: 'destroy',
        LOAD: 'load',
        PLAY: 'play',
        RELOAD: 'reload',
        TIMEOUT: 'timeout'
    };

    iframeContainer = $('#players');
    options = {
        reload: 120 * 60000,
        timeout: 30000
    };
    pti = _definePTI();
    callbacks = $.Callbacks();

    iframeObserver = {
        destroy: destroy,
        init: init,
        listen: _.bind(callbacks.add, callbacks),
        options: options,
        pti: pti,
        reload: reload,
        STATE: STATE
    };

    return iframeObserver;

    function _appendIframe() {
        var playerIframe;

        youtubeReady = $.Deferred();
        soundcloudReady = $.Deferred();
        iframeContainer.html('<iframe class="leftFull temp-border-none temp-width-hundred-percent" src="http://' + host + '/iframe-player.html?origin=' + window.location.href + '"></iframe>');
        playerIframe = iframeContainer.find('iframe').get(0).contentWindow;
        if (iw == null) {
            iw = _defineIframeWrapper(playerIframe);
        } else {
            iw.iframe = playerIframe;
        }
    }

    function _defineIframeWrapper(playerIframe) {
        var iw;

        iw = new IframeWrapper(playerIframe, ["http://" + host]);
        iw.listenAllEvents(pti.players);

        return iw;
    }

    function _definePTI() {
        var pti = new PTI({
            onLoadVideo: (function () {
                var _type, _videoId, _playerState, lastReady;

                return function (type, videoId, playerState) {
                    if (_type && _videoId) {
                        _type = type;
                        _videoId = videoId;
                        _playerState = playerState;
                    } else if (lastReady == null) {
                        iframeObserver.init().then(function() {
                            iw.postMessage('pti', 'playing', pti.playing());
                            iw.postMessage('pti', 'volume', pti.volume());
                            iw.postMessage('pti', 'loadVideo', _type, _videoId, _playerState);
                            _type = null;
                            _videoId = null;
                            _playerState = null;
                            lastReady = Date.now();
                        });
                        _type = type;
                        _videoId = videoId;
                        _playerState = playerState;
                    } else if (Date.now() - lastReady >= iframeObserver.options.reload) {
                        iframeObserver.reload().then(function() {
                            iw.postMessage('pti', 'playing', pti.playing());
                            iw.postMessage('pti', 'volume', pti.volume());
                            iw.postMessage('pti', 'loadVideo', _type, _videoId, _playerState);
                            _type = null;
                            _videoId = null;
                            _playerState = null;
                            lastReady = Date.now();
                        });
                        _type = type;
                        _videoId = videoId;
                        _playerState = playerState;
                    } else {
                        iw.postMessage('pti', 'loadVideo', type, videoId, playerState);
                    }
                }
            })(),
            onPlaying: function (boolean) {
                if (boolean && this.scope.data.playing == null) {
                    this.scope.data.playing = true;
                    var _state = {
                        selectedVideoIndex: window.playlist.getSelectedVideoIndex(),
                        playing: true,
                        volume: $.jStorage.get('volume')
                    };
                    _state.selectedVideoIndex = _state.selectedVideoIndex >= 0 ? _state.selectedVideoIndex : 0;
                    window.playlist.playVideo({ index: _state.selectedVideoIndex }, _state.playerState);
                    this.scope.volume(_state.volume);
                } else {
                    arguments[3] !== 'iframe-wrapper' && iw && iw.postMessage(this.type, this.operation, boolean);
                }
            },
            onPlayVideo: function () {
                iw.postMessage(this.type, this.operation);
            },
            onPauseVideo: function () {
                iw.postMessage(this.type, this.operation);
            },
            onSeekTo: function (seekTo) {
                iw.postMessage(this.type, this.operation, seekTo);
            },
            onVolume: function (volume) {
                iw.postMessage(this.type, this.operation, volume);
            },
            onError: function () {
                SiteHandlerManager.prototype.stateChange('ERROR');
            }
        })

        new pti.Player('y', {
            onLoadVideo: function (videoObject) {
                iw.postMessage(this.type, this.operation, videoObject);
            },
            onStopVideo: function () {
                iw.postMessage(this.type, this.operation);
            },
            onCurrentTime: function (time) {
            },
            onPlayerState: function (state) {
                if (state == 0) {
                    SiteHandlerManager.prototype.stateChange('NEXT');
                }
            },
            onPlayerReady: function (playerState) {
                youtubeReady.resolve();
            }
        })
        new pti.Player('s', {
            onLoadVideo: function (videoId) {
                iw.postMessage(this.type, this.operation, videoId);
            },
            onInitializePlayer: function () {
                iw.postMessage(this.type, this.operation);
            },
            onCurrentTime: function (time) {
//        console.log('from main')
//        console.log(time)
            },
            onPlayerState: function (state) {
                if (state == 0) {
                    SiteHandlerManager.prototype.stateChange('NEXT');
                }
            },
            onPlayerReady: function (playerState) {
                soundcloudReady.resolve();
            }
        })
        new pti.Player('v', {
            onLoadVideo: function (videoId) {
                iw.postMessage(this.type, this.operation, videoId);
            },
            onCurrentTime: function (time) {
//        console.log('from main')
//        console.log(time)
            },
            onPlayerState: function (state) {
                if (state == 0) {
                    SiteHandlerManager.prototype.stateChange('NEXT');
                }
            }
        })
        return pti;
    }

    function _events() {
        $('#playersContainer').on('click', '#parsedError a', reload);
    }

    function _loadPlayer() {
        var failTimeout;

        _state(STATE.LOAD);
        _appendIframe();
        $.when(youtubeReady, soundcloudReady).then(function() {
            clearTimeout(failTimeout);
            observerReady.resolve();
            _state(STATE.PLAY);
        });
        failTimeout = setTimeout(function() {
            _removeIframe();
            _loadPlayer();
        }, iframeObserver.options.timeout);
        $.when(youtubeReady, soundcloudReady).fail(_.partial(clearTimeout, failTimeout));
    }

    function _removeIframe() {
        youtubeReady.reject();
        soundcloudReady.reject();
        iframeContainer.find('iframe').attr('src', null)
        iframeContainer.empty();
        iw.iframe = null;
    }

    function _state(_state) {
        if(arguments.length) {
            state = _state;
            $('#playersContainer').toggleClass('destroyed', _state == STATE.DESTROY);
            $('#playersContainer').toggleClass('playing', _state == STATE.PLAY);
            $('#playersContainer').toggleClass('loading', _state == STATE.LOAD);
            callbacks.fire(_state);
        }

        return state;
    }

    function destroy() {
        observerReady.reject(STATE.DESTROY);
        _removeIframe();
        _state(STATE.DESTROY);
    }

    function init(options) {
        var parseReload, parseTimeout;

        if(_state() == undefined) {
            observerReady = $.Deferred();
            parseTimeout = parseFloat(options && options.timeout);
            iframeObserver.options.timeout = _.isNaN(parseTimeout) ? iframeObserver.options.timeout : parseTimeout * 1000;
            parseReload = parseFloat(options && options.reload);
            iframeObserver.options.reload = _.isNaN(parseReload) ? iframeObserver.options.reload : parseReload * 60000;
            _events();
            _loadPlayer();
        }

        return observerReady;
    }

    function reload() {
        observerReady.reject(STATE.RELOAD);
        observerReady = $.Deferred();
        _removeIframe();
        _loadPlayer();

        return observerReady;
    }
})
