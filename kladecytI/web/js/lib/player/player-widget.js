define(["jquery", "underscore"], function (a, b) {
    function PlayerWidget(elementExpression, dontCreateContent) {
        var self = this
        var temp = new Object()
        this.data = {listenObject:null}
        if(!dontCreateContent) {
//            this.jPlayerWidget = $('<div class="playerWidget"><div class="play button"></div><div class="next button"></div><div class="prev button"></div><a class="progressBarContainer" <!-- TOOLTIP title="yoyoyoyo" --> ><div class="progressBar"></div></a></div>').appendTo(elementExpression)
            this.jPlayerWidget = $('<div class="playerWidget"><div class="next button"></div><div class="play button"></div><div class="prev button"></div><div class="progressBarContainer"><div class="progressBar"></div><div class="trackLength"></div></div></div>').appendTo(elementExpression)
        } else {
            this.jPlayerWidget = $($(elementExpression).children()[0])
        }

        this.trackLength = 60
        this.progress = 0
        this.jProgressBar = this.jPlayerWidget.find('.progressBar')
        this.jProgressBarContainer = $(this.jPlayerWidget.find('.progressBarContainer'))
        this.jPlay = this.jPlayerWidget.find('.play')
        this.jPrev = this.jPlayerWidget.find('.prev')
        this.jNext = this.jPlayerWidget.find('.next')
        this.jCurrentTime = $('<div class="progressBarCurrentTime"></div>').appendTo(this.jProgressBar)
        this.jBackgroundCurrentTime = $('<div class="progressBarBackgroundCurrentTime"></div>').appendTo(this.jProgressBar)
        this.jTrackLength = $('<div class="progressBarTrackLength"></div>').appendTo(this.jProgressBar)
        this.jBackgroundTrackLength = $('<div class="progressBarBackgroundTrackLength"></div>').appendTo(this.jProgressBarContainer)
        this.jProgressBarCursorTime = $('<div class="progressBarCursorTime"></div>').appendTo(this.jPlayerWidget)
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
            var jElement = $(this)
            jElement.removeClass('play')
            jElement.addClass('pause')
            self.data.listenObject.playVideo()
        })

        this.jPlayerWidget.on('click', '.pause', function () {
            var jElement = $(this)
            jElement.removeClass('pause')
            jElement.addClass('play')
            self.data.listenObject.pauseVideo()
        })
        this.jPlayerWidget.on('click', '.prev', function () {
            playlist.playVideo({videoDiv: playlist.lookupPrevSong()})
        })
        this.jPlayerWidget.on('click', '.next', function () {
            playlist.playVideo({videoDiv: playlist.lookupNextSong()})
        })
        this.jPlayerWidget.on('click', '.progressBarContainer', function (evt) {
            var jElement = $(this)
            var moveTo = evt.pageX / jElement.width() * 100
            self.progressBar(moveTo)
            var seconds = self.trackLength * ( moveTo / 100)
            self.data.listenObject.seekTo(seconds)
        })

        this.jPlayerWidget.on('mousedown', '.button', function () {
            var jElement = $(this)
            jElement.addClass('mouseDown')
        })
        this.jPlayerWidget.on('mouseup', '.button', function () {
            var jElement = $(this)
            jElement.removeClass('mouseDown')
        })

        var mouseMoveOut = function(evt, ui) {
            if(evt.relatedTarget && $(evt.relatedTarget).attr('class').match(/progressBar/)) return;
            self.jProgressBarCursorTime.hide('slow')
        }

        var throttleMouseMove = _.throttle(function (jElement, evt) {
                self.jProgressBarCursorTime.show('fast')
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
            var props = self.data.listenObject.get(['currentTime', 'duration', 'playerState']);
            var currentTime = props[0];
            var duration = props[1]
            var playerState = props[2]
//        console.log(currentTime)
            self.trackLength != duration && self.jBackgroundTrackLength.text(_.formatDuration(duration)) | self.jTrackLength.text(_.formatDuration(duration))
            self.trackLength = duration
            self.progressBar(currentTime, self.trackLength)
            if (playerState == 1) {
                self.jPlay.removeClass('play')
                self.jPlay.addClass('pause')
            } else if (playerState == 2) {
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
