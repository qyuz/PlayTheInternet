define(["jquery", "jquery-jobbing"], function () {
//GENERIC START
    window.tabs = { first: {}, second: {} }

    function playlistsFactory($nav, $playlistsEl, jStorageType, headerConfigKey, tabs, getPlaylist) {
        var initPlaylists = _.once(function (Playlists) {
            tabs[jStorageType] = new Playlists($playlistsEl, {
                jStorageType: jStorageType,
                playlistHeaderConfigKey: headerConfigKey,
                playlistTabsGetPlaylist: function () {
                    this.tabsGetPlaylist = getPlaylist
                }
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

    function fetchSynch() {
        require(["app/background/synchronization"], function (synchronization) {
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
            if (newTabText == "Options") {
                require(["app/common/hash-qr"], function (redraw) {
                    redraw()
                })
            }
            if (newTabText == "Player") {
                tabsPlayerContainer.removeClass('temp-absolute-off-scren')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('temp-absolute-off-scren')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
            if (newTabText == "Playlists") {
            }
            if (newTabText == "Synchronized") {
                fetchSynch()
            }
            if (newTabText == "Devices(Read Only)") {
                fetchSynch()
            }
        }
    })

//first player start
    var tabsPlayerContainer = $('#playersContainer')
//first player end

//first options start
//first options end

//first playlists start
    $('#tabs').on('click', 'ul>li>a', function () {
        window.tabs.first.playlist = null
    })
    $('#firstView').on('click', '[href="#tAreaDiv"]', function () {
        window.tabs.first.playlist = typeof textParsePlaylist !== "undefined" ? textParsePlaylist : null
    })
    $('#firstView').on('click', '#tAreaParseButton', function () {
        window.tabs.first.playlist = textParsePlaylist
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
    $('#ulFirstDevices').on('click', '.image-div', function () {
        window.tabs.first.playlist = window.tabs.first.devices.playlist
    })
    firstGetPlaylist = function () {
        return window.tabs.first.playlist ? window.tabs.first.playlist : window.tabs.second.playing
    }
    window.tabs.first.getPlaylist = firstGetPlaylist

    var selectFirstPlaylists = playlistsFactory($('a[href="#firstPlaylistsDiv"]'), $("#ulFirstPlaylists"), "playlists", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, secondGetPlaylist)
    var selectFirstSynchronized = playlistsFactory($('a[href="#firstSynchronizedDiv"]'), $("#ulFirstSynchronized"), "synchronized", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, secondGetPlaylist)
    var selectFirstDevices = playlistsFactory($('a[href="#firstDevicesDiv"]'), $("#ulFirstDevices"), "devices", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, secondGetPlaylist)
//first playlists end

//first dropdown start
//    $.dropdown($('#playlistsDropdown'), $('#tabs').find('.playlistsDropdown>a'))
//    $.dropdown($('#parseDropdown'), $('#tabs').find('.parseDropdown>a'))
//    $.dropdown($('#optionsDropdown'), $('#tabs').find('.optionsDropdown>a'))
//first dropdown end

    $firstTabs.tabs("option", "active", 1)
//FIRST CREATE TABS END

//SECOND CREATE TABS START
    var $secondTabs = $('#secondViewTabs').tabs({
        active: -1,
        activate: function (event, ui) {
            var newTab = $(ui.newTab);
            var newTabText = newTab.text().trim();
            if (newTabText == "Playing") {
                require(["app/common/hash-qr", "pti-playlist"], function (redrawHashAndQRCode, Playlist) {
                    window.tabs.second.playlist = initPlaying(redrawHashAndQRCode, Playlist)
                })
            }
            if (newTabText == "Playlists") {
            }
            if (newTabText == "Synchronized") {
                fetchSynch()
            }
            if (newTabText == "Devices(Read Only)") {
                fetchSynch()
            }
        }
    })

//second playing start
    var initPlaying = _.once(function (redrawHashAndQRCode, Playlist) {
        var selected = $.jStorage.get("selected_backgroundPageId"), index = selected && selected.index >= 0 && selected.index
        window.tabs.second.playing = new Playlist("#ulSecond", {
                id: $.jStorage.get('playingId'),
                notice: "This is your playlist. Drop songs in here and listen.",
                scrollTo: index,
                recalculateContentImmediateCallback: redrawHashAndQRCode,
                connectWith: "connected-playlist",
                headerConfigKey: "lConfigPlaylistHeader",
                execute: [
                    Playlist.prototype.playAction,
                    Playlist.prototype._listenPlayingIdExecute
                ]
            }
        )
        window.playlist = window.tabs.second.playing //can remove this
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
    $('#ulSecondDevices').on('click', '.image-div', function () {
        window.tabs.second.playlist = window.tabs.second.devices.playlist
    })
    function secondGetPlaylist () {
        return window.tabs.second.playlist ? window.tabs.second.playlist : window.tabs.second.playing
    }
    window.tabs.second.getPlaylist = secondGetPlaylist

    var selectSecondPlaylists = playlistsFactory($('a[href="#sPlaylists"]'), $("#ulSecondPlaylists"), "playlists", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, firstGetPlaylist)
    var selectSecondSynchronizedPlaylists = playlistsFactory($('a[href="#sSynchronized"]'), $("#ulSecondSynchronized"), "synchronized", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, firstGetPlaylist)
    var selectSecondDevicesPlaylists = playlistsFactory($('a[href="#sDevices"]'), $("#ulSecondDevices"), "devices", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, firstGetPlaylist)

//second playlists end
//SECOND CREATE TABS END

    $secondTabs.tabs("option", 'active', 0)
})
