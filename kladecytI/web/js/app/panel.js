'use strict';

define(["player/player-widget", "underscore", "app/common/tabs"], function(PlayerWidget, b, tabs) {
    var backgroundWindow, destroyedPlayer, STATE, $window;

    tabs.$firstTabs.tabs("option", 'active', 1);
    var setWindowTitle = _.setWindowTitle.bind(window);
    chrome.windows.getAll(function (windows) {
        if(_.findWhere(windows, { type: 'panel' })) {
            $window = $(window);
            backgroundWindow = chrome.extension.getBackgroundPage();
            window.playlist = backgroundWindow.playlist;
            window.playerWidget = new PlayerWidget('#playerWidgetContainer', true);

            window.playlist.on('selected', setWindowTitle);
            window.addEventListener("unload", _.bind(window.playlist._callbacksRemove, window.playlist, 'selected', setWindowTitle), true);
            window.playerWidget.data.listenObject = backgroundWindow.ptiManager.pti;

            $('#tabs a[href="#player"]').one('click', function() {
                require(["player/iframe-observer"], function(observer) {
                    STATE = observer.STATE;
                    window.observer = observer;
                    window.pti = observer.pti;
                    backgroundWindow.ptiManager.playingWindow(window);
                    observer.listen(function(action) {
                        if (action == STATE.DESTROY) {
                            destroyedPlayer = true;
                            state('stretch-close');
                        } else if (action == STATE.PLAY && destroyedPlayer) {
                            backgroundWindow.ptiManager.playingWindow(window);
                        }
                    });
                });
            });

            $('.playerWidget .stretch-video-view.control').click(function() {
                var $body;

                $body = $('body');

                $('#tabs a[href="#player"]').click();
                $body.addClass('stretch-video-view');
                window.resizeTo(463, 384);
                tabViewIsOpen = true;
            });

            var tabViewIsOpen;
            $('.playerWidget .tab-view.control').click(function() {
                var $window;

                $window = $(window);

                tabViewIsOpen ? window.resizeTo($window.width(), 100) : window.resizeTo($window.width(), 800);
                tabViewIsOpen = !tabViewIsOpen;
            });

            $('#stretch-video-control>.stretch-close>svg').click(_.partial(state, 'stretch-close'));
            $('#stretch-video-control>.player-widget-toggle>svg').click(_.partial(state, 'player-widget-toggle'));
            $('#stretch-video-control>.playing-on-top-toggle>svg').click(function() {
                var $body, playingIsOnTop;

                $body = $('body');
                playingIsOnTop = $body.hasClass('playing-on-top');

                $body.toggleClass('playing-on-top', !playingIsOnTop);
            });
        } else {
            window.resizeTo(410, 136);
            $('body').on('click', 'a', function() {
                chrome.windows.create({
                    url: 'chrome://flags/#enable-panels',
                    width: 800,
                    height: 600
                });
            });
            $('body').html('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-error"><b>Panel is an experimental feature which should be<br>enabled first.</b><br><a href="chrome://flags/#enable-panels" target="_blank">Follow this link to enable panels and then click<br>"Relaunch Now" to restart Chrome.</a></div> </div> </div> </div>');
        }
    });

    function state(state) {
        var $body;

        $body = $('body');
        state == 'stretch-close' && $body.removeClass('stretch-video-view', state == 'stretch-close');
        state == 'player-widget-toggle' && $body.toggleClass('player-widget');
    }
});