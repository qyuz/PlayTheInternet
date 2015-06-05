'use strict';

define(["pti-playlist", "player/iframe-observer", "app/common/globals", "jstorage", "underscore", "common/parse-the-extension"], function(Playlist, observer, c, d, e, ParseTheExtension) {
    $.jStorage.get('playingId') || $.jStorage.set('playingId', 'lPlaylist' + _.guid());
    window.observer = observer;
    window.pti = observer.pti;
    window.ptiManager = new PtiManager();
    window.parseTheInternet = ParseTheExtension();

    $(document).ready(function () {
        window.playlist = new Playlist("#ulSecond", {
            id:$.jStorage.get('playingId'),
            fillVideoElement:false,
            playerType: true,
            execute: [
                Playlist.prototype._listenPlayingIdExecute
            ]
        });
        window.playlist.on('selected', function(typeId) {
            try {
                chrome.browserAction.setTitle({ title: JSON.parse(localStorage.getItem(typeId.id)).title });
            } catch (e) {
                chrome.browserAction.setTitle({ title: typeId.id });
            }
        });
        require(["app/background/synchronization", "app/background/commands", "app/background/contextMenus"], function(synchronization) {
            synchronization.init()
        });
    });

    function PtiManager() {
        var ptiManager, currentWindow, backgroundWindow;

        ptiManager = this;
        ptiManager.pti = window.pti;
        currentWindow = backgroundWindow = window;

        ptiManager.currentState = function() {
            return collectState(backgroundWindow.playlist, ptiManager.pti);
        };
        ptiManager.startBackgroundPlayer = function() {
            ptiManager.playingWindow(window);
        };
        ptiManager.playingWindow = function(_window) {
            if (arguments.length) {
                var currentState, loadPlayer, then, concurrentWindows;

                concurrentWindows = _.without(window.chrome.extension.getViews(), currentWindow, _window, backgroundWindow);
                _.forEach(concurrentWindows, function(__window) {
                    __window.observer && __window.observer.destroy();
                });

                if (_window == backgroundWindow) {
                    currentState = ptiManager.currentState();
                }
                loadPlayer = _window.observer.init();
                then = function() {
                    if (_window != backgroundWindow) {
                        currentState = ptiManager.currentState();
                        _window.addEventListener("unload", ptiManager.startBackgroundPlayer, true);
                    }
                    startPlayer(_window, currentState);
                    _.forEach(window.chrome.extension.getViews(), function(__window) {
                        __window.playerWidget && (__window.playerWidget.data.listenObject = _window.pti);
                        if (__window != _window) {
                            stopPlayer(__window);
                            if (__window != backgroundWindow) {
                                __window.observer && __window.observer.destroy();
                                __window.removeEventListener("unload", ptiManager.startBackgroundPlayer, true);
                            }
                        }
                    });
                    ptiManager.pti = _window.pti;
                    currentWindow = _window;
                };
                loadPlayer.state() == 'resolved' ? then() : loadPlayer.then(then);
            }

            return currentWindow;
        };
    }

    function collectState(_playlist, _pti) {
        var state;
        if (_pti && _pti.data.currentPlayer) { //_pti check is used in startBackground when Playing is null and Play is clickd
            var ptiState = _pti.get(['currentTime', 'soundIndex']);
            state = {
                selectedVideoIndex: _playlist.getSelectedVideoIndex(),
                playerState: { start: ptiState[0], index: ptiState[1] },
                playing: _pti.playing(),
                volume: _pti.volume()
            };
        } else {
            state = {
                selectedVideoIndex: _playlist.getSelectedVideoIndex(),
                playing: true,
                volume: $.jStorage.get('volume')
            };
        }
        state.selectedVideoIndex = state.selectedVideoIndex >= 0 ? state.selectedVideoIndex : 0;
        return state;
    }

    function startPlayer(_window, _state) {
        try {
            _window.playlist.playerType(true);
            _window.playlist.playVideo({ index: _state.selectedVideoIndex }, _state.playerState);
            _window.pti.playing(_state.playing);
            _window.pti.volume(_state.volume);
        } catch (e) {
        }
    }

    function stopPlayer(_window) {
        try {
            _window.playlist.playerType(false);
            _window.pti.pauseVideo();
        } catch(e) {
        }
    }
});
