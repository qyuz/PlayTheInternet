define(["common/ptilist", "pti-playlist"], function (ptilist, Playlist) {
    var Ptilist = ptilist.Ptilist
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
        me.$.container.addClass("pti-action-open")

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

    Playlists.prototype._PtiElement = PlaylistsElement

    Playlists.prototype._redrawContent = function(storageObject) {
        this.updateElements(storageObject.data)
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

    var PtiElement = ptilist.PtiElement
    PlaylistsElement.prototype = new PtiElement()
    PlaylistsElement.prototype.constructor = PlaylistsElement
    PlaylistsElement.prototype.parent = PtiElement.prototype
    function PlaylistsElement(playlistData) {
        this.parent._constructor.call(this, playlistData)
    }

    PlaylistsElement.prototype.init = function(playlistData) {
        this.$.html(PTITemplates.prototype.PlaylistsElement(playlistData))
        this.$.droppable({
            accept: ".pti-element-video",
            drop: function(event, ui) {
                var ids = '', playlistId = this.element.id, uiselected
                var ptilist = ui.draggable.parent().data('ptilist'), playlistDao = Playlist.prototype.DAO(playlistId)
                if(ui.draggable.hasClass('ui-selected')) {
                    ids = ptilist.getIdsUiSelected()
                    uiselected = ptilist.getPtiElementsUiSelected()
                } else {
                    ids = [ui.draggable[0].id]
                }
                playlistDao.addVideos(ids, { source: "" }).set()
                //TODO PtiElement
                ui.draggable.remove()               //                Ptilist.prototype._removePtiElements(ui.draggable)
                uiselected && uiselected.remove();  //                uiselected && Ptilist.prototype._removePtiElements(uiselected)
            }.bind(this),
            hoverClass: "drop-hover"
        })
    }

    PlaylistsElement.prototype.fields = {
        id: {
            update: function(computed, data, $, i, field, self) {
                $.prop('id', computed)
            }
        },
        length: {
            compute: function(data, $, i, field, self) {
                return data.data.length
            },
            update: function(computed, data, $, i, field, self) {
                $.find('.pti-count').text(computed)
            }
        },
        name: {
            update: function(computed, data, $, i, field, self) {
                $.find('.pti-name').val(computed)
            }
        },
        thumbnail: {
            update: function(comuted, data, $, i, field, self) {
                $.find('.image-div>img').attr('src', comuted)
            }
        },
        removeDialog: {
            always: true,
            compute: function(data, $, i, field, self) {
                if(self.lastComputed.id != data.id) {
                    return false
                }
                return $.find('.pti-remove-playlist-dialog').hasClass('temp-display-none-important')
            },
            update: function(computed, data, $) {
                $.find('.pti-remove-playlist-dialog').toggleClass('temp-display-none-important', computed)
                $.find('.pti-remove-playlist-yes, .pti-remove-playlist-no').toggleClass('temp-display-none-important', !computed)
            }
        },
        synchronization: {
            compute: function(data, $, i, field, self) {
                if(data.id.match(/^sPlaylist/)) {
                    return data.source == 'sync' || data.source == 'local' ? data.source : 'upsert'
                } else {
                    return undefined
                }
            },
            update: function(computed, data, $, i, field, self) {
                if(computed == null) {
                    return
                }
                var $status = $.find('.pti-status')
                $status.toggleClass('pti-main-text', computed == 'sync')
                $status.toggleClass('pti-warning-text', computed == 'upsert')
                $status.toggleClass('pti-error-text', computed == 'local')
                if(computed == 'sync') {
                    $status.text('S')
                    $status.prop('title', "Last synchronized at " + new Date(data.updated).toLocaleTimeString() + " on " + new Date(data.updated).toDateString() + ".")
                }
                if(computed == 'upsert') {
                    $status.text('U')
                    $status.prop('title', "Scheduled for synchronization.")
                }
                if(computed == 'local') {
                    $status.text('L')
                    $status.prop('title', "This playlist is removed from synchronization and is available only on this PC.")
                }
            }
        },
        ui_selected: {
            always: true,
            compute: function(data, $, i, field, self) {
                if(self.lastComputed.id != data.id) {
                    return false
                }
                return $.hasClass('ui-selected')
            },
            update: function(computed, data, $, i, field, self) {
                $.toggleClass('ui-selected', computed)
            }
        }
    }

    return Playlists
})