define(["jquery-ui", "underscore"], function () {
//GENERIC START
    window.tabs = { first: {}, second: {} }
    var playingReady = $.Deferred()
    var lPlaylistsNotice = 'Here are all your playlists that are bound to this PC. You can create playlist by hitting the "+" button in any playlist you see.';
    var sPlaylistsNotice = 'Here are all your playlists that will be shared between PCs, just don\'t forget to sign in chrome. You can create synchronized playlist by hitting the "+" button in any playlist you see.';

    function playlistsFactory($nav, $playlistsEl, jStorageType, headerConfigKey, tabs, getPlaylist, noticeMessage) {
        var initPlaylists = _.once(function (Playlists) {
            tabs[jStorageType] = new Playlists($playlistsEl, {
                jStorageType: jStorageType,
                playlistHeaderConfigKey: headerConfigKey,
                playlistQuickPlay: function() {
                    this.getIdsUiSelected().length ? this.createPlaylist('qPlaylist', 'Quick Play', true) : this._playThis(this.options.id)
                },
                playlistTabsGetPlaylist: function () {
                    this.tabsGetPlaylist = getPlaylist
                },
                notice: noticeMessage
            })
            return tabs[jStorageType]
        })
        var selectNav = function () {
            require(["common/playlists"], function (Playlists) {
                initPlaylists(Playlists).playlistClose()
            })
        }
        $nav.click(selectNav)
        return selectNav
    }

    function playlistFactory($nav, $playlistsEl, name, headerConfigKey, tabs, getPlaylist, quickPlay, id, defaultName, noticeMessage) {
        var initPlaylist = _.once(function(Playlist) {
            tabs[name] = new Playlist($playlistsEl, {
                playerType: false,
                connectWith: "connected-playlist",
                headerConfigKey: headerConfigKey,
                quickPlay: quickPlay,
                id: id,
                defaultName: defaultName,
                notice: noticeMessage,
                execute: [
                    Playlist.prototype.addAction,
                    function () {
                        this.tabsGetPlaylist = getPlaylist
                    }
                ]
            })
            return tabs[name]
        })
        var selectNav = function() {
            require(["pti-playlist"], function (Playlist) {
                tabs.playlist = initPlaylist(Playlist)
            })
        }
        $nav.click(selectNav)
        return selectNav
    }

    function fetchSynch() {
        chrome.extension.getBackgroundPage().require(["app/background/synchronization"], function (synchronization) {
            chrome.storage.sync.get(function (sync) {
                var start = Date.now()
                for (var key in sync) {
                    synchronization.syncListenerUpsert(sync, key, start)
                }
            })
        })
    }

//GENERIC END

//FIRST CREATE TABS START
    var $firstTabs = $('#tabs').tabs({
        activate: function (event, ui) {
            var newTab = $(ui.newTab);
            var newTabText = newTab.text().trim();
            if (newTabText == "Playing") {
                require(["app/common/hash-qr", "pti-playlist"], function (hashqr, Playlist) {
                    window.tabs.first.playlist = initPlaying(hashqr.redraw, Playlist, "lConfigPanelPlaylistHeader")
                })
            }
            if (newTabText == "Share") {
                require(["app/common/hash-qr"], function (hashqr) {
                    hashqr.redraw()
                    initShare(hashqr)
                })
            }
            if (newTabText == "Player") {
                tabsPlayerContainer.removeClass('temp-absolute-off-screen')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('temp-absolute-off-screen')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
            if (newTabText == "Playlists") {
            }
            if (newTabText == "Synch") {
                fetchSynch()
            }
            if (newTabText == "Install") {
                require(["app/web/install"])
            }
        },
        beforeActivate: function (event, ui) {
            ui.oldPanel.addClass('shlop')
            _.defer(function () {
                ui.newPanel.removeClass('shlop')
            })
        }
    })

//first player start
    var tabsPlayerContainer = $('#playersContainer')
//first player end

//first textParse start
    var selectTextAreaPlaylist = playlistFactory($('a[href="#tAreaDiv"]'), $("#textAreaParsePlaylist"), 'textParse', "lConfigTextAreaParsePlaylistHeader", window.tabs.first, secondGetPlaylist, function() {
        this.createPlaylist('qPlaylist', 'Quick Play', true) //we want code to be synchronous, so had to avoid require
    })
    $('#tAreaParseButton').click(function () {
        var tAreaText = $('#tArea').val()
        window.tabs.first.textParse._emptyContent();
        window.tabs.first.textParse.addElements(_.stringToArray(window.parseTheInternet.parseToString(tAreaText)), true);
    })
//first textParse end

//first share start
    var initShare = _.once(function(hashqr) {
        playingReady.then(function() {
            window.playlist.on('selected', hashqr.setFullURL)
        })
    })
//first share end

//first playlists start
    $('#tabs').on('click', 'ul>li>a', function () {
        window.tabs.first.playlist = null
    })
    $('#firstView').on('click', '[href="#parsedDiv"]', function () {
        window.tabs.first.playlist = parsedPlaylist
    })
    $('#ulFirstPlaylists').on('click', '.image-div', function () {
        window.tabs.first.playlist = window.tabs.first.playlists.playlist
    })
    $('#ulFirstSynchronized').on('click', '.image-div', function () {
        window.tabs.first.playlist = window.tabs.first.synchronized.playlist
    })
    function firstGetPlaylist () {
        return window.tabs.first.playlist ? window.tabs.first.playlist : window.tabs.second.playing
    }
    window.tabs.first.getPlaylist = firstGetPlaylist

    var selectFirstPlaylists = playlistsFactory($('a[href="#firstPlaylistsDiv"]'), $("#ulFirstPlaylists"), "playlists", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, secondGetPlaylist, lPlaylistsNotice)
    var selectFirstSynchronized = playlistsFactory($('a[href="#firstSynchronizedDiv"]'), $("#ulFirstSynchronized"), "synchronized", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, secondGetPlaylist, sPlaylistsNotice)
//first playlists end

//first recycle start
    var selectRecyclePlaylist = playlistFactory($('a[href="#recycleDiv"]'), $("#recyclePlaylist"), 'recycle', "lConfigRecyclePlaylistHeader", window.tabs.first, secondGetPlaylist, function() {
        this.getIdsUiSelected().length ? this.createPlaylist('qPlaylist', 'Quick Play', true) : this._playThis(this.options.id)
    }, 'rPlaylist', 'Recycle', "This is your Recycle Bin. Songs in here won't synchronize between PCs. Remember: clicking recycle bin button in player widget will add songs at the top.")
//first recycle end
//FIRST CREATE TABS END

//SECOND CREATE TABS START
    var $secondTabs = $('#secondViewTabs').tabs({
        active: -1,
        activate: function (event, ui) {
            var newTab = $(ui.newTab);
            var newTabText = newTab.text().trim();
            if (newTabText == "Playing") {
                require(["app/common/hash-qr", "pti-playlist"], function (hashqr, Playlist) {
                    window.tabs.second.playlist = initPlaying(hashqr.redraw, Playlist, "lConfigPlaylistHeader")
                })
            }
            if (newTabText == "Playlists") {
            }
            if (newTabText == "Synch") {
                fetchSynch()
            }
            if (newTabText == "Help") {
                require(["app/common/how"])
            }
            if (newTabText == "Panel") {
                _.openPanel()
                chrome.windows.getAll(function (windows) {
                    if(_.findWhere(windows, { type: 'panel' })) {
                        $('#panelDiv').html('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-success">You\'ve successfully opened a panel.<br>Make good use of it!</div> </div> </div> </div>')
                    } else {
                        $('#panelDiv').html('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-danger"><b>Unable to open panel. Follow instructions in open popup window to enable panels.</a></div> </div> </div> </div>')
                    }
                })
            }
        },
        beforeActivate: function (event, ui) {
            ui.oldPanel.addClass('shlop')
            _.defer(function () {
                ui.newPanel.removeClass('shlop')
            })
        }
    })

//second playing start
    var initPlaying = _.once(function (redrawHashAndQRCode, Playlist, headerConfigKey) {
        if(window.chrome && window.chrome.extension) {
            var playingId = $.jStorage.get("playingId"), selected = $.jStorage.get("selected_" + playingId), index = selected && selected.index >= 0 && selected.index
            var playingOptions = {
                id: playingId,
                playerType: false,
                scrollTo: index,
                execute: [
                    Playlist.prototype.playAction,
                    Playlist.prototype._listenPlayingIdExecute
                ]
            }
        } else {
            var playingOptions = {
                id: null,
                playerType: true,
                scrollTo: 0,
                execute: [
                    Playlist.prototype.playAction
                ]
            }
        }
        window.tabs.second.playing = new Playlist("#ulSecond", _.extend({
                notice: "This is your playlist. Drop songs in here and listen.",
                connectWith: "connected-playlist",
                headerConfigKey: headerConfigKey
            }, playingOptions)
        )
        window.playlist = window.tabs.second.playing //can remove this
		window.playlist.on('change', redrawHashAndQRCode)
		window.playlist.on('selected', _.setWindowTitle)
        playingReady.resolve()
        return window.tabs.second.playing
    })
//second playing end

//second playlists start
    $('#secondViewTabs').on('click', 'ul>li>a', function () {
        window.tabs.second.playlist = null
    })
    $('#ulSecondPlaylists').on('click', '.image-div', function () {
        window.tabs.second.playlist = window.tabs.second.playlists.playlist
    })
    $('#ulSecondSynchronized').on('click', '.image-div', function () {
        window.tabs.second.playlist = window.tabs.second.synchronized.playlist
    })
    function secondGetPlaylist () {
        return window.tabs.second.playlist ? window.tabs.second.playlist : window.tabs.second.playing
    }
    window.tabs.second.getPlaylist = secondGetPlaylist

    var selectSecondPlaylists = playlistsFactory($('a[href="#sPlaylists"]'), $("#ulSecondPlaylists"), "playlists", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, firstGetPlaylist, lPlaylistsNotice)
    var selectSecondSynchronizedPlaylists = playlistsFactory($('a[href="#sSynchronized"]'), $("#ulSecondSynchronized"), "synchronized", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, firstGetPlaylist, sPlaylistsNotice)

//second playlists end
//second options start
    $('#nightTheme').prop('checked', localStorage.getItem('theme') == 'night')
    $('#nightTheme').click(function(item) {
        var currTheme = $(item.target).prop('checked') ? 'night' : 'day'
        localStorage.setItem('theme', currTheme)
        $('html').attr('id', currTheme)
    })
//second options end
//SECOND CREATE TABS END

    //convenience stuff after tab initialization
    $('#tabs>.nav>li>a, #secondViewTabs>.nav>li>a').css('pointer-events', 'all')
    $secondTabs.tabs("option", 'active', 0)

    return { $firstTabs: $firstTabs, $secondTabs: $secondTabs, playingReady: playingReady }
})
