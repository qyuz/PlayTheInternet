'use strict';

define(["pti-playlist", "player/iframe-observer", "app/common/globals", "jstorage", "underscore"], function(Playlist, observer, c, d, e) {
    $.jStorage.get('playingId') || $.jStorage.set('playingId', 'lPlaylist' + _.guid());

    $(document).ready(function () {
        window.observer = observer;
        window.pti = observer.pti;
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

        window.ptiManager = new PtiManager();
    });

    function PtiManager() {
        var ptiManager, currentWindow, backgroundWindow;

        ptiManager = this;
        currentWindow = backgroundWindow = window;

        ptiManager.currentState = function() {
            return collectState(currentWindow.playlist, currentWindow.pti);
        };
        ptiManager.startBackgroundPlayer = function() {
            var currentState;

            ptiManager.playingWindow(window);
        };
        ptiManager.playingWindow = function(_window) {
            if (arguments.length) {
                var currentState, prevWindow, loadPlayer, then;

                prevWindow = currentWindow;
                currentState = ptiManager.currentState();
                if (prevWindow) {
                    prevWindow.playlist.playerType(false);
                    try { prevWindow.pti.pauseVideo() } catch(e) {} //will throw exception when background isn't initialized
                }

                currentWindow = _window;
                loadPlayer = currentWindow.observer.init();
                then = function() {
                    if (prevWindow != backgroundWindow) {
                        prevWindow && prevWindow != currentWindow && prevWindow.observer && prevWindow.observer.destroy();
                        prevWindow.removeEventListener("unload", ptiManager.startBackgroundPlayer, true); //unload
                    }
                    currentWindow != backgroundWindow && currentWindow.addEventListener("unload", ptiManager.startBackgroundPlayer, true);
                    startPlayer(currentWindow, currentState);
                    currentWindow.playerWidget.data.listenObject = currentWindow.pti;
                };
                if (loadPlayer.state() == 'resolved') {
                   then();
                } else {
                    loadPlayer.then(then);
                    loadPlayer.fail(function(reason) {
                        if (reason != currentWindow.observer.FAIL_REASON.DESTROY) {
                            currentWindow.observer.reload();
                        }
                    });
                }
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
        _window.playlist.playerType(true);
        _window.playlist.playVideo({ index: _state.selectedVideoIndex }, _state.playerState);
        _window.pti.playing(_state.playing);
        _window.pti.volume(_state.volume);
    }
});
