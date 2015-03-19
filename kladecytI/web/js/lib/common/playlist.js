define(["common/ptilist"], function (ptilist) {
    var Ptilist = ptilist.Ptilist
    Playlist.prototype = new Ptilist()
    Playlist.prototype.constructor = Playlist
    Playlist.prototype.parent = Ptilist.prototype
    function Playlist(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this._init(appendToElementExpression, options)
    }

    Playlist.prototype._init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        me.options.defaultName = me.options.defaultName || "Rename me"
        me.options.ptiElementClass = "pti-element-video " + _.default(me.options.ptiElementClass, "")
        me.options.fillVideoElement = _.default(me.options.fillVideoElement, true)
        me.options.playerType = _.default(me.options.playerType, false)
        me.options.callbacks = [{ name: 'selected', flags: 'memory' }]
        me.parent._init.call(this, appendToElementExpression, me.options)
        me._recalculateContentImmediateFire = function(){}

        if(options.execute && options.execute.length) {
            options.execute.forEach(function(item) {
                _.isFunction(item) && item.call(me)
            })
        }
    }

    Playlist.prototype._createHeader = function () {
        var me = this
        var $header = this.parent._createHeader.call(this)
        var $menu = $('<div class="pti-menu temp-display-none"/>')

        var createPlaylistDialogToggle = function() {
            if(!$addPlaylist.hasClass('selected')) {
                $addPlaylist.addClass('selected')
                createPlaylistDialog()
            } else {
                closeCreatePlaylistDialog()
            }
        }

        var createPlaylistCloseTimeout
        var createPlaylistDialog = function() {
            $menu.removeClass('temp-display-none')
            $input.focus()
        }
        var closeCreatePlaylistDialog = function() {
            clearTimeout(createPlaylistCloseTimeout)
            $addPlaylist.removeClass('selected')
            $menu.addClass('temp-display-none')
            $input.prop('disabled', false)
            $input.val('')
//            $input.css('color', "")
        }

        var createPlaylistHandler = _.throttle(function(play) {
            $input.prop('disabled', true)

            var name = $input.val()
            var radio = $menu.find('input[type="radio"]:checked').parent().text()
            var type = radio.match('Playlist') ? 'l' : 's'
            var id = type + "Playlist" + _.guid()
            me.createPlaylist(id, name, play)

            $input.val('Playlist created')
//            $input.css('color', 'green')
            createPlaylistCloseTimeout = setTimeout(function() {
                closeCreatePlaylistDialog()
            }, 2000)
        }, 2000, { trailing: false })

        var inputHandler = function(event) {
            if(event.keyCode == 13) {
                createPlaylistHandler()
            }
        }

        me.options.quickPlay && $('<div class="pti-header-button temp-playlist-header-margin-left">►</div>').appendTo($header).click(me.options.quickPlay.bind(this))
        var $addPlaylist = $('<div class="pti-header-button temp-playlist-header-margin-left">+</div>').appendTo($header).click(createPlaylistDialogToggle)

        //menu start
        var createRadio = function(label, group, checked) {
            var guid = _.guid()
            return $('<label for="' + guid + '" class="squaredTwo"> <input id="' + guid + '" class="max-width" type="radio" name="' + group + '"' + (checked ? ' checked="checked"' : '') + '"/> <label for="' + guid +'"></label>'+ label +'</label>')
        }
        var $input = $('<input type="text" class="create-playlist-name" placeholder="Playlist name to create"/>').appendTo($menu).keypress(inputHandler)
        var group = _.guid()
        $menu.append(createRadio('Playlist', group, (window.chrome && window.chrome.extension) ? null : "checked" ))
        $menu.append(createRadio('Synchronized', group, (window.chrome && window.chrome.extension) ? "checked" : null))
        var $create = $('<input type="button" value="Create"/>').appendTo($menu).click(_.partial(createPlaylistHandler, false))
        $menu.append('<label>and start</label>')
        var $andPlay = $('<input type="button" value="Playng"/>').appendTo($menu).click(_.partial(createPlaylistHandler, true))

        return $header.add($menu)
    }

    Playlist.prototype._createPlaylist = function(id, name, playlist, thumbnail, play) {
        $.jStorage.set('selected_' + id, { index: 0, date: Date.now() })
        var dao = Playlist.prototype.DAO(id).setVideos(playlist, { name: name, thumbnail: thumbnail, source: "" })
        dao.set()
        play && Playlist.prototype._playThis(id)
    }

    Playlist.prototype._drawPtiElement = function(typeIdText, $ptiElement) {
        return SiteHandlerManager.prototype.drawPtiElement(typeIdText, $ptiElement, this.options.fillVideoElement)
    }

    Playlist.prototype._getSelectedVideoDiv = function() {
        return this.$.content.find('.selected')
    }

    Playlist.prototype._listenPlayingId = function(key, action) {
        var playingId = $.jStorage.get('playingId')
        this.setId(playingId)
    }

    Playlist.prototype._listenPlayingIdExecute = function() {
        $.jStorage.listenKeyChange('playingId', this._listenPlayingId.bind(this))
        var $playingName = $('<input type="text" class="playing-name"/>').val(Playlist.prototype.DAO(this.options.id).storageObj.name), _redrawContent = this._redrawContent.bind(this), me = this
        this.$.playingName = $playingName.appendTo(this.$.header.eq(0))
        $playingName.keypress(function (event) {
            if (event.keyCode == 13) {
                $(this).blur()
            }
        })
        var oldName
        $playingName.focusin(function () {
            oldName = $(this).val()
        }).focusout(function () {
            var newName = $(this).val()
            if (oldName !== newName) {
                var dao = playlist.DAO(me.options.id).update({ name: newName, source: me.options.uid }).set()
            }
        })
        this._redrawContent = function(storageObject) {
            _redrawContent(storageObject)
            $playingName.val(Playlist.prototype.DAO(this.options.id).storageObj.name)
        }
    }

    Playlist.prototype._listenPlaySelectedVideo = function (key, action) {
        var storageData = this._redrawContentGetCacheObject(key, action, 'listen play selected video', true)
        storageData && storageData.play && storageData.index >= 0 && this.playVideo({ index: storageData.index }, storageData.playerState, false)
    }

    Playlist.prototype._playThis = function(playlistId) {
        window.playlist.options.id != playlistId && (window.chrome && window.chrome.extension ? $.jStorage.set('playingId', playlistId) : window.playlist.setId(playlistId)) //TODO dirty, do other way
        window.playlist.scrollToSelected()
        var selected = $.jStorage.get("selected_" + playlistId), selectedId = selected && selected.index >= 0 && Playlist.prototype.DAO(playlistId).storageObj.data[selected.index]
        if(selectedId) {
            var typeId = _.stringToTypeId(selectedId)
            window.playerWidget.loadVideo(typeId.type, typeId.id)
            _.delay(_.bind(window.playerWidget.data.listenObject.playVideo, window.playerWidget.data.listenObject), 400) //using delay because idk the hell why makes _listenPlayingId execute twice on app's first invocation
        } else {
            window.playlist.playNextVideo()
        }
    }

    Playlist.prototype._recalculateContentBuildStorageObject = function() {
        var superObject = this.parent._recalculateContentBuildStorageObject.call(this)
        var storageObject = $.jStorage.get(this.options.id)
        var recalculatedObject = _.extend(storageObject ? storageObject : { name: this.options.defaultName }, superObject)
        return recalculatedObject
    }

    Playlist.prototype._recalculateContentImmediate = function(cache) {
        this.parent._recalculateContentImmediate.call(this, cache)
        this.options.id && $.jStorage.set('selected_' + this.options.id, { source: this.options.uid, index: this.getSelectedVideoIndex(), date: Date.now() })
        this._callbacksFire('change')
    }

    Playlist.prototype._redrawContent = function(storageObject, scrollTo) {
        if(storageObject.data) {
            this.parent._redrawContent.call(this, storageObject, scrollTo)
            var selectedVideo = $.jStorage.get('selected_' + this.options.id)
            selectedVideo && selectedVideo.index >= 0 && this.selectVideo({index: selectedVideo.index}, false)
        }
    }

    Playlist.prototype._setPlaySelectedVideoListen = function(id) {
        this._listenPlaySelectedVideoLast && $.jStorage.stopListening("selected_" + id, this._listenPlaySelectedVideoLast)
        this._listenPlaySelectedVideoLast = this._listenPlaySelectedVideo.bind(this)
        this.options.id && $.jStorage.listenKeyChange("selected_" + this.options.id, this._listenPlaySelectedVideoLast)
    }

    Playlist.prototype.addAction = function () {
        Playlist.prototype.setActionBackground.call(this)
        this.$.container.addClass('pti-action-add')
        var me = this
        this.$.content.on('click', '.pti-element', function (event) {
            if ($(event.target).prop('tagName').match(/^[aA]$/) == null) {
                var selected = '', $this = $(this), uiselected
                if ($this.hasClass('ui-selected')) {
                    selected = me.getIdsUiSelected()
                    uiselected = me.getPtiElementsUiSelected().not($this)
                    uiselected.remove()
                } else {
                    selected = [this.id]
                }
//            console.log(selected)
                me.tabsGetPlaylist().addElements(selected, true)
                var remove = function() {
                    $(this).remove();
                    me._recalculateContentImmediate()
                }.bind(this)
                $this.height(0)
                _.delay(remove, 150);
            }
        })
    }

    Playlist.prototype.buildHash= function() {
        return '#' + this.getIds()
    }

    Playlist.prototype.createPlaylist = function(id, name, play) {
        var selected = this.getIdsUiSelected(), playlist = selected.length ? selected : this.getIds()
        var thumbnail = SiteHandlerManager.prototype.getThumbnail( playlist.length ? playlist[0] : "" )
        this._createPlaylist(id, name, playlist, thumbnail, play)
    }

    Playlist.prototype.DAO = function(key) {
        var obj = $.jStorage.get(key)
        var storageObj = _.extend({ id: key }, obj)
        storageObj.data = _.stringToArray(storageObj.data)
        return dao = {
            key: key,
            storageObj: storageObj,
            addVideos: function(videosArr, extend) {
                this.storageObj.data = this.storageObj.data.concat(videosArr)
                _.isUndefined(extend) ||  this.update(extend)
                return this
            },
            delete: function() {
                $.jStorage.deleteKey(this.key)
                $.jStorage.deleteKey("selected_" + this.key)
                return this
            },
            exists: function() {
                return Boolean(obj)
            },
            serialize: function() {
                this.storageObj.data = _.arrayToString(this.storageObj.data)
                return this
            },
            set: function (serialize) {
                _.default(serialize, true) && this.serialize()
                $.jStorage.set(this.key, this.storageObj)
                console.log('set', this.storageObj)
                return this
            },
            setVideos: function(videosArr, extend) {
                this.storageObj.data = []
                return this.addVideos(videosArr, extend)
            },
            unshiftVideos: function(videosArr, extend) {
                this.storageObj.data = videosArr.concat(this.storageObj.data)
                _.isUndefined(extend) ||  this.update(extend)
                return this
            },
            update: function (obj, update) {
                _.default(update, true) && _.extend(obj, { updated: Date.now() })
                _.extend(this.storageObj, obj)
                return this
            }
        }
    }

    Playlist.prototype.getSelectedVideoDiv = function() {
        var selectedDiv = this._getSelectedVideoDiv();
        return selectedDiv.length ? selectedDiv : null
    }

    Playlist.prototype.getSelectedVideoIndex = function() {
        return this.getPtiElements().index(this._getSelectedVideoDiv())
    }

    Playlist.prototype.getVideoDivAndData = function (video) {
        console.log(video)
        var videoDiv
        var videoData
        var songs = this.getPtiElements();
        if(video && video.index >= 0) {
            videoDiv = songs[video.index]
            videoData = $(videoDiv).data('data')
            return {videoData:videoData, videoDiv:videoDiv, index:video.index}
        }
        if(video && video.videoDiv) {
            var index = songs.index(video.videoDiv)
            videoData = $(video.videoDiv).data('data')
            return {videoData:videoData, videoDiv:video.videoDiv, index:index}
        }
        if(video && video.videoData) {
            for(var index=0; index<songs.length; index++) {
                var vf = $(songs[index]).data('data')
                if(vf.type == video.videoData.type && vf.id == video.videoData.id) {
                    return {videoData:vf, videoDiv:songs[index], index:index}
                }
            }
        }
        if (!videoData) {
            throw "videoData or video is empty in getVideoDivAndData"
        }
    }

    Playlist.prototype.lookupNextSong = function () {
        return this.getPtiElements()[this.lookUpNextSongIndex()]
    }

    Playlist.prototype.lookUpNextSongIndex = function() {
        var index = this.getSelectedVideoIndex()
        index = index >= this.getIdsCount() - 1 ? 0 : ++index
        return index
    }

    Playlist.prototype.lookupPrevSong = function () {
        var index = this.getSelectedVideoIndex()
        index = index <= 0 ? this.getIdsCount() - 1 : --index
        return this.getPtiElements()[index]
    }

    Playlist.prototype.playAction = function () {
        this.$.container.addClass('pti-action-play')
        Playlist.prototype.setActionBackground.call(this)
        var me = this
        this.$.content.on('click', '.pti-element', function (event) {
            if ($(event.target).prop('tagName').match(/^[aA]$/) == null) {
                me.playVideo({videoDiv: $(this)})
            }
        })
    }

    Playlist.prototype.playerType = function (boolean) {
        _.isUndefined(boolean) || (this.options.playerType = boolean)
        return this.options.playerType
    }

    Playlist.prototype.playNextVideo = function () {
        this.playVideo({videoDiv:this.lookupNextSong()})
    }

    Playlist.prototype.playVideo = function(video, playerState, setStorage) {
        console.log(video)
        var videoObject = this.getVideoDivAndData(video)
        this.selectVideo(videoObject, setStorage)
        if (this.playerType()) {
            pti.playing(true)
            SiteHandlerManager.prototype.playVideoData(videoObject.videoData, playerState)
        } else {
            console.log('not a player type')
        }
    }

    Playlist.prototype.scrollToSelected = function() {
        this.scrollTo(this.getSelectedVideoIndex())
    }

    Playlist.prototype.selectVideo = function (video, setStorage, play) {
        this.getPtiElements().removeClass("selected")
        var videoObject = this.getVideoDivAndData(video)
        var videoData = videoObject.videoData
        var videoDiv = videoObject.videoDiv
        $(videoDiv).addClass("selected")
        videoDiv && this._callbacksFire('selected', _.stringToTypeId(videoDiv.id))
        if (this.options.id && _.default(setStorage, true)) {
            console.log('setting currVideoData to storage')
            $.jStorage.set("selected_" + this.options.id, { source:this.options.uid, index:this.getSelectedVideoIndex(), play: _.default(play, true), date: Date.now() })
        }
    }

    Playlist.prototype.setActionBackground = function() {
        this.$.container.addClass('pti-action-background')
    }

    Playlist.prototype.setId = function(id, listenId, scrollTo) {
        this.parent.setId.call(this, id, listenId, scrollTo)
        this._setPlaySelectedVideoListen(id)
    }

    return Playlist
})