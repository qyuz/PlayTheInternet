define(["common/ptilist", "pti-playlist"], function (Ptilist, Playlist) {
    Playlists.prototype = new Ptilist()
    Playlists.prototype.constructor = Playlists
    Playlists.prototype.parent = Ptilist.prototype
    function Playlists(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this._init(appendToElementExpression, options)
    }

    Playlists.prototype.jStorageTypeMapping = {
        playlists: {
            sorted: "playlists",
            prefix: "lPlaylist"
        },
        synchronized: {
            sorted: "synchronized",
            prefix: "sPlaylist"
        }
    }

    Playlists.prototype._init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        me.options.elementSplit = "one"
        me.options.jStorageType = _.default(me.options.jStorageType, "playlists")
        me.options.jStorageTypeValues = Playlists.prototype.jStorageTypeMapping[me.options.jStorageType]
        me.parent._init.call(this, appendToElementExpression, me.options)

        //$.container
        me.$.container.addClass("pti-action-background")

        //playlist
        me.$.playlist = $('<div></div>').appendTo(me.$.container.parent())
        me.initPlaylist = _.once(function() {
            me.playlist = new Playlist(me.$.playlist,
                {
                    connectWith: "connected-playlist",
                    elementSize: me.options.playlistElementSize,
                    elementSplit: me.options.playlistElementSplit,
                    headerConfigKey: me.options.playlistHeaderConfigKey,
                    quickPlay: me.options.playlistQuickPlay,
                    execute: [
                        Playlist.prototype.addAction,
                        me.options.playlistTabsGetPlaylist
                    ]
                })
        })
        //playlist

        //click handlers
        me.$.content.on('click', '.pti-sortable-handler.image-div', function(event, ui) {
            var playlistId = me.getPtiElement(this).attr('id')
            me.playlistOpen(playlistId)
        })

        me.$.content.on('click', '.pti-play-this', function(event, ui) {
            var $button = $(this), playlistId = me.getPtiElement(this).attr('id');
            Playlist.prototype._playThis(playlistId)
        })

        me.$.content.on('click', '.pti-add-all', function(event, ui) {
            var $button = $(this), playlistId = me.getPtiElement(this).attr('id')
            var dao = playlist.DAO(playlistId)
            playlist.addElements(dao.storageObj.data)
        })

        me.$.content.on('click', '.pti-remove-playlist-dialog', function(event, ui) {
            var $button = $(this);
            $button.addClass('temp-display-none-important')
            $button.siblings().removeClass('temp-display-none-important')
        })
        me.$.content.on('click', '.pti-remove-playlist-yes', function(event, ui) {
            var playlistId = me.getPtiElement(this).attr('id')
            playlist.DAO(playlistId).delete()
            $.jStorage.get('playingId') == playlistId && (window.playlist._emptyContent() | (window.chrome && window.chrome.extension && window.chrome.extension.getBackgroundPage().window.playlist._emptyContent()))
        })
        me.$.content.on('click', '.pti-remove-playlist-no', function(event, ui) {
            var $button = $(this), $parent = $button.parent();
            $parent.children().not('.pti-remove-playlist-dialog').addClass('temp-display-none-important')
            $parent.children('.pti-remove-playlist-dialog').removeClass('temp-display-none-important')
        })

        var oldName
        me.$.content.on('focusin', '.pti-name', function() {
            oldName = $(this).val()
        })
        me.$.content.on('focusout', '.pti-name', function() {
            var newName = $(this).val()
            if (oldName !== newName) {
                var playlistId = me.getPtiElement(this).attr('id')
                var dao = playlist.DAO(playlistId).update({ name: newName, source: me.options.uid }).set()
            }

        })

        me.$.content.on('keypress', '.pti-name', function (event) {
            if (event.keyCode == 13) {
                $(this).blur()
            }
        })
        //click handlers

//        me.redrawJContentFromCacheListen = _.debounce(function (key, action) {
//            me.redrawJContentGeneric(key, action, 'listener redraw playlists from cache', true)
//        }, 50)
        me.setId(me.options.jStorageTypeValues.sorted, "*")
    }

    Playlists.prototype._createHeader = undefined

    Playlists.prototype._drawPtiElement = function (playlistData, $ptiElement) {
        $ptiElement.append(PTITemplates.prototype.PlaylistsVideoElement(playlistData))
        return $ptiElement
    }

    Playlists.prototype._redrawContent = function(storageObject) {
        this.parent._redrawContent.call(this, storageObject)
        var me = this
        console.log(me.getPtiElements())
        me.getPtiElements().droppable({
            accept: ".pti-element-video",
            drop: function(event, ui) {
                var ids = '', playlistId = this.id, uiselected
                var ptilist = ui.draggable.parent().data('ptilist'), playlistDao = Playlist.prototype.DAO(playlistId)
                if(ui.draggable.hasClass('ui-selected')) {
                    ids = ptilist.getIdsUiSelected()
                    uiselected = ptilist.getPtiElementsUiSelected()
                } else {
                    ids = [ui.draggable[0].id]
                }
                playlistDao.addVideos(ids, { source: "" }).set()


                var remove = function() {
                    $(this).remove();
                }
                ui.draggable.remove()
                uiselected && uiselected.remove();
                console.log('songId, playlistId: ', ids, playlistId)
                console.log(event)
                console.log(ui)
                console.log(this)
            },
            hoverClass: "drop-hover"
        })
    }

    Playlists.prototype._redrawContentGetCacheObject = function (key, action, functionName, filterOwn) {
        var pattern = "^(" + this.options.jStorageTypeValues.sorted + "|" + this.options.jStorageTypeValues.prefix + ".+)$"
        if (key.match(pattern)) {  // /^(playlists|lPlaylist.+)$/
            var storageObj = this.parent._redrawContentGetCacheObject.call(this, key, action, functionName, this.options.jStorageTypeValues == Playlists.prototype.jStorageTypeMapping.synchronized ? false : filterOwn) //not filtering own because of "upsert" sync status update
            if (!_.isUndefined(storageObj)) { //undefined means filtered by source === uid
                var playlists = { data: this.filterJStorageBy(this.typeLocalPlaylist, this.sortLocalPlaylist) }
                return playlists
            }
        }
    }

    Playlists.prototype.playlistClose = function() {
        this.$.playlist.addClass('temp-display-none')
        this.$.container.removeClass('temp-display-none')
    }

    Playlists.prototype.playlistOpen = function(id) {
        this.initPlaylist()
        this.playlist.setId(id)
        this.$.container.addClass('temp-display-none')
        this.$.playlist.removeClass('temp-display-none')
    }

    Playlists.prototype.filterJStorageBy = function(filter, sort) {
        var storageObj = $.jStorage.storageObj(), jStorageKeys = Object.keys(storageObj.__proto__), resultArr = new Array(), resultKeys = new Array(), me = this
        //filter
        resultKeys = jStorageKeys.filter(function(key) {
            return key.match("^" + me.options.jStorageTypeValues.prefix)
        })
        //filter end
        //sort
//      resultKeys = sort(storageObj, resultKeys)
        var sortedPlaylistIds, playlistsOrder = storageObj[this.options.jStorageTypeValues.sorted] ? _.stringToArray(storageObj[this.options.jStorageTypeValues.sorted].data) : [], newKeys = _.difference(resultKeys, playlistsOrder)
        newKeys.reverse()
        sortedPlaylistIds = newKeys.concat(playlistsOrder)
        resultKeys = sortedPlaylistIds
        //sort end
        resultKeys.forEach(function (key) {
            if(storageObj[key]) {
                var item = _.extend({}, storageObj[key]);
                item.data = _.stringToArray(item.data)
                resultArr.push(item)
            }
        })
        return resultArr
    }

//    Playlists.prototype.typeLocalPlaylist = function(key) {
//        return key.match("^" + this.options.jStorageTypeValues.prefix)
//    }

//    Playlists.prototype.sortLocalPlaylist = function(storageObj, filteredKeys) {
//        var sortedPlaylistIds, playlistsOrder = storageObj[this.options.jStorageTypeValues.sorted] ? _.stringToArray(storageObj[this.options.jStorageTypeValues.sorted].data) : [], newKeys = _.difference(filteredKeys, playlistsOrder)
//        newKeys.reverse()
//        sortedPlaylistIds = newKeys.concat(playlistsOrder)
//        return sortedPlaylistIds
//    }

    return Playlists
})