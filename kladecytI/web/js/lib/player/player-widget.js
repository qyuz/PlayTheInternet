define(["jquery", "underscore", "jstorage"], function (a, b, c) {
    function PlayerWidget(elementExpression, dontCreateContent) {
        var self = this
        var temp = new Object()
        this.data = {listenObject:null}
        if(!dontCreateContent) {
//            this.jPlayerWidget = $('<div class="playerWidget"><div class="play button"></div><div class="next button"></div><div class="prev button"></div><a class="progressBarContainer" <!-- TOOLTIP title="yoyoyoyo" --> ><div class="progressBar"></div></a></div>').appendTo(elementExpression)
            this.jPlayerWidget = $('<div class="playerWidget"><div class="next control"></div><div class="play control"></div><div class="prev control"></div><input class="volume control" type="range" min="0" max="100"/><div class="progressBarContainer"><div class="progressBar"></div><div class="trackLength"></div></div></div>').appendTo(elementExpression)
        } else {
            this.jPlayerWidget = $($(elementExpression).children()[0])
        }

        this.trackLength = 60
        this.progress = 0
        this.volume = $.jStorage.get('volume')
        this.jProgressBar = this.jPlayerWidget.find('.progressBar')
        this.jProgressBarContainer = $(this.jPlayerWidget.find('.progressBarContainer'))
        this.jPlay = this.jPlayerWidget.find('.play')
        this.jPrev = this.jPlayerWidget.find('.prev')
        this.jNext = this.jPlayerWidget.find('.next')
        this.jVolume = this.jPlayerWidget.find('.volume.control')
        this.jCurrentTime = $('<div class="progressBarCurrentTime"></div>').appendTo(this.jProgressBar)
        this.jBackgroundCurrentTime = $('<div class="progressBarBackgroundCurrentTime"></div>').appendTo(this.jProgressBar)
        this.jTrackLength = $('<div class="progressBarTrackLength"></div>').appendTo(this.jProgressBar)
        this.jBackgroundTrackLength = $('<div class="progressBarBackgroundTrackLength"></div>').appendTo(this.jProgressBarContainer)
        this.jProgressBarCursorTime = $('<div class="progressBarCursorTime"></div>').insertAfter(this.jProgressBarContainer)

        this.jVolume.val(this.volume == null ? 100 : this.volume)
        this.jVolume.attr('step', 5)

        PlayerWidget.prototype.progressBar = function (currentTime, trackLength) {
            var progress = currentTime / trackLength * 100
            if (typeof progress == "undefined") {
                return this.progress
            }
            this.progress = progress
            this.jProgressBar.css('width', this.progress + '%')
            var progressBarWidth = this.jProgressBar.width();
            var progressBarContainerWidth = this.jProgressBarContainer.width();
            this.jCurrentTime.css('width', progressBarWidth + 'px')
            var containerBarEpsilon = progressBarContainerWidth - progressBarWidth
            var jTrackLengthWidth = this.jBackgroundTrackLength.width() - containerBarEpsilon
            this.jTrackLength.css('width', jTrackLengthWidth + 'px')
            var convertedTime = _.formatDuration(currentTime);
            this.jCurrentTime.text(convertedTime)
            this.jBackgroundCurrentTime.text(convertedTime)
        }

        this.jPlayerWidget.on('click', '.play', function () {
            self.data.listenObject.playVideo()
        })

        this.jPlayerWidget.on('click', '.pause', function () {
            self.data.listenObject.pauseVideo()
        })
        this.jPlayerWidget.on('click', '.prev', function () {
            playlist.playVideo({videoDiv: playlist.lookupPrevSong()})
        })
        this.jPlayerWidget.on('click', '.next', function () {
            playlist.playVideo({videoDiv: playlist.lookupNextSong()})
        })

        var lastConfirm
        this.jPlayerWidget.on('click', '.recycle', function (elt) {
            var $elt = $(elt.currentTarget)
            if(!$elt.hasClass('confirm')) {
                clearTimeout(lastConfirm)
                $(elt.currentTarget).removeClass('confirmed').addClass('confirm')
                lastConfirm = _.delay(_.bind($elt.removeClass, $elt, 'confirm'), 3000)
            }
        })
        this.jPlayerWidget.on('click', '.recycle.confirm', function (elt) {
            clearTimeout(lastConfirm)
            require(["pti-playlist"], function(Playlist) {
                var $elt = $(elt.currentTarget), $toRemove = window.playlist._getSelectedVideoDiv()
                var selectedIndex = window.playlist.getSelectedVideoIndex(), nextIndex = window.playlist.lookUpNextSongIndex()
                var recycleId
                if($toRemove.length) {
                    recycleId = $toRemove.attr('id')
                    $toRemove.remove()
                    window.playlist._recalculateContentImmediate()
                } else {
                    var _pti = self.data.listenObject
                    _pti.data.currentPlayer && _pti.data.videoId && (recycleId = _.typeIdToString({ type: _pti.data.currentPlayer, id: _pti.data.videoId }))
                }
                if(selectedIndex != nextIndex) {
                    var calcNextIndex = nextIndex == 0 ? 0 : --nextIndex, toPlayTypeIdString = window.playlist.getIds()[calcNextIndex], toPlay
                    window.playlist.selectVideo({ index: calcNextIndex }, true, false)
                    toPlayTypeIdString && (toPlay = _.stringToTypeId(toPlayTypeIdString)) && _.delay(_.bind(window.playerWidget.loadVideo, window.playerWidget, toPlay.type, toPlay.id), 100) //fix animation stutter
                }
                window.playlist.getIdsCount() || window.playerWidget.data.listenObject.pauseVideo()
                recycleId && setTimeout(function() {
                    Playlist.prototype.DAO('rPlaylist').unshiftVideos([recycleId], { source: undefined }).set()
                }, 100)
                $elt.removeClass('confirm').addClass('confirmed')
                lastConfirm = _.delay(_.bind($elt.removeClass, $elt, 'confirmed'), 1500)
            })
        })

        this.jPlayerWidget.on('change', '.volume.control', function () {
            var volume = Number($(this).val())
            debounceVolume(volume)
        })
        this.jPlayerWidget.on('mousewheel', '.volume.control', function(event) {
            var $range = $(this), range = Number($range.val())
            $range.focus() //set focus on mousewheel so you can control slider using arrow keys. consider moving focus to .onhover
            $range.val(range = event.originalEvent.wheelDelta > 0 ? range + 5 : range - 5 )
            debounceVolume(range)
        })

        this.jPlayerWidget.on('click', '.progressBarContainer', function (evt) {
            var jElement = $(this)
            var moveTo = evt.pageX / jElement.width() * 100
            self.progressBar(moveTo)
            var seconds = self.trackLength * ( moveTo / 100)
            self.data.listenObject.seekTo(seconds)
        })

        this.jPlayerWidget.on('mousedown', '.control:not(.volume.control)', function () {
            var jElement = $(this)
            jElement.addClass('mouseDown')
        })
        this.jPlayerWidget.on('mouseup', '.control:not(.volume.control)', function () {
            var jElement = $(this)
            jElement.removeClass('mouseDown')
        })

        var debounceVolume = _.debounce(function(volume) {
            volume = volume < 0 ? 0 : volume > 100 ? 100 : volume //sanity check, also mousewheel tends to go above 100
            $.jStorage.set('volume', volume)
            self.data.listenObject.volume(volume)
        }, 200)

        var mouseMoveOut = function(evt, ui) {
            if(evt.relatedTarget && $(evt.relatedTarget).attr('class').match(/progressBar/)) return;
        }

        var throttleMouseMove = _.throttle(function (jElement, evt) {
                var progress = evt.pageX / jElement.width() * 100
                var seconds = self.trackLength * ( progress / 100)
                self.jProgressBarCursorTime.text(_.formatDuration(seconds))
                self.jProgressBarCursorTime.css('left', evt.pageX + 15 + 'px')
            }, 50
        , {trailing: false}
        )

        this.jPlayerWidget.on('mousemove', '.progressBarContainer', function (evt) {
            throttleMouseMove($(this), evt)
        })
        this.jPlayerWidget.on('mouseout', '.progressBarContainer', mouseMoveOut)
//        self.jProgressBarContainer.tooltip({track:true})

        this.listenInterval = setInterval(function () {
            var props = self.data.listenObject.get(['currentTime', 'duration']);
            var currentTime = props[0];
            var duration = props[1]
            var playing = self.data.listenObject.playing()
//        console.log(currentTime)
            self.trackLength != duration && self.jBackgroundTrackLength.text(_.formatDuration(duration)) | self.jTrackLength.text(_.formatDuration(duration))
            self.trackLength = duration
            self.progressBar(currentTime, self.trackLength)
            if (playing) {
                self.jPlay.removeClass('play')
                self.jPlay.addClass('pause')
            } else {
                self.jPlay.removeClass('pause')
                self.jPlay.addClass('play')
            }
        }.bind(this), 100)
    }

    PlayerWidget.prototype.loadVideo = function(type, id, playerState) {
        this.data.listenObject.loadVideo(type, id, playerState)
    }

    return PlayerWidget
})
