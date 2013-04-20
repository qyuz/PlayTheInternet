function VideoElement(videoFeed, appendTo) {
    var div

    this.createDiv = function (videoFeed) {
        var childDiv = $('<div/>')
        this.div = $('<div/>').append(childDiv)
        this.div.addClass('pti-state-default')
        $(appendTo).append(this.div)
        if (videoFeed != null) {
            this.fillDiv(videoFeed)
        }
    }

    this.fillDiv = function (videoFeed) {
        this.div.empty()
        childDiv = $('<div/>').appendTo(this.div)
        var durationCaption = $('<div/>')
        durationCaption.addClass('duration-caption')
        durationCaption.text(videoFeed.durationCaption)

        var imgDiv = $('<div/>')
        imgDiv.addClass('image-div')

        var img = $('<img/>')
        img.attr('src', videoFeed.thumbnail)

        var span = $('<span/>')
        var b = $('<b>').text(videoFeed.title)
        span.append(b)
        span.append("<br>by " + videoFeed.uploader)

        var buttonSpan = $('<span style="float: left; width: 12px; height: 90px;"/>')
        var closeButton = $('<img style="width: 10px; height: 10px;" src="/jqC/css/custom/close.jpg">')
        buttonSpan.append(closeButton)

        imgDiv.append(img)
        imgDiv.append(durationCaption)
        childDiv.append(imgDiv)
//        childDiv.append(buttonSpan)
        childDiv.append(span)
        childDiv.click(function (evt) {
//            yte.playVideoDiv(this.div[0])
            var evObj = document.createEvent('HTMLEvents');
            evObj.initEvent('PlayVideo', true, true);
            this.div[0].dispatchEvent(evObj); // Shows alert, "true"
        }.bind(this))
        closeButton.click(function (evt) {
            evt.stopPropagation()
            this.toggleClass("disabled-Video")
            yte.pla.recalculatePlaylist()
        }.bind(childDiv))
        durationCaption.css('left', 120 - durationCaption.width() - 3)
        durationCaption.css('top', 90 - durationCaption.height() - 3)

        this.div.data("videoFeed", videoFeed)

        return this.div
    }

    this.createDiv(videoFeed)

    return this
}

function VideoFeed(item, parent) {
    if (item == null) throw "kladecyt: null vId argument in VideoFeed Constructor"
    if (item.thumbnail != null) {
        this.id = item.id
        this.type = item.type
        this.duration = item.duration
        this.durationCaption = convert(item.duration)
        this.title = item.title
        this.uploader = item.uploader
        this.thumbnail = item.thumbnail.sqDefault
    } else if (item.id.$t != "") {
        this.id = item.id.$t.replace(/.*video\:(.*)/, "$1")
        this.duration = item.media$group.media$content[0].duration
        this.durationCaption = convert(this.duration)
        this.title = item.title.$t
        this.uploader = item.author[0].name.$t
        this.thumbnail = item.media$group.media$thumbnail[0].url
    } else {
        this.error = "incompatible type"
        console.log("incompatible type" + item)
    }
}

function IntercomWrapper(windowId) {
    if (window.intercom) {
        window.intercom.handlers = []
    }
    Intercom.destroy()
    window.intercom = Intercom.getInstance()
    window.intercom.on(windowId + 'playlistReceived', function (data) {
        initPlayer(data.message)
        try {
            yte.pla.addSongsToPlaylist(data.message, null, true)
        } finally {
            intercom.emit(data.sender + 'playlistReceived', { sender:windowId, ctrl:data.ctrl, type:'playlistReceived', status:'success'})
        }
        console.log(data)
    });
    window.intercom.on('windowId', function (data) {
        intercom.emit(data.sender + 'windowId', { sender:windowId })
    });
}

function Playlist(appendToElementExpression) {
    this.containerElementExpression = appendToElementExpression
    this.playlist
    this.currSong

    this.recalculatePlaylist = function () {
        this.playlist = $(this.containerElementExpression + " div").filter(function (index, item) {
//            console.log($(item).hasClass("disabled-Video"))
            item = $(item)
            return item.data("videoFeed") != null && !(item.hasClass("disabled-Video"))
        })
    }

    Playlist.prototype.buildHash = function () {
        return "#" + _.reduce(this.playlistSongIds(), function (memo, videoId) {
            return memo.concat("y=" + videoId + ",")
        }, "")
    }

    this.lookupNextSong = function (currSong) {
        var index = this.playlist.toArray().indexOf(currSong)
        index = index >= this.playlist.length - 1 ? 0 : ++index
        return this.playlist[index]
    }

    this.addSongsToPlaylist = function (links, finished, unique) {
        var responseCounterWrapper = {
            responseCounter:0
        }
        var playlistFinishedLoading = function (playlistSize, current) {
            if (playlistSize == current) {
                this.recalculatePlaylist()
                if (finished != null) {
                    finished()
                }
            }
        }.bind(this)
        if (unique == true) {
            var oldLinks = this.playlistSongIds()
            links = links.filter(function (newId) {
                return oldLinks.indexOf(newId) == -1 ? true : false
            })
        }

        links.forEach(function (videoItem) {
            var videoElement = new VideoElement(null, this.containerElementExpression)
//            videoElements.push(videoElement)
            var linkContext = {
                responseCounterWrapper:responseCounterWrapper,
                videoElement:videoElement,
                playlistFinishedLoading:playlistFinishedLoading,
                links:links,
                videoItem:videoItem,
                retryCounter:0
            }
//            siteHandlerManager.getHandler(videoItem.type).loadVideoFeed(linkContext);
            siteHandlerManager.loadVideoFeed(linkContext)
        }.bind(this))
    }

    this.parseSongIds = function (text) {
        var youtube = /([\w]+)=([^ &\"\'<>\/\\,]{11})/g
        var youtubeLinks = text.match(youtube)
        return _.unique(youtubeLinks.map(function (item) {
            return {"type":item.replace(youtube, "$1"), "id":item.replace(youtube, "$2") }
        }), function (item) {
            return item.type + item.id
        })
    }

    this.playlistSongIds = function () {
        if (this.playlist) {
            return this.playlist.map(function (index, div) {
                return $(div).data('videoFeed').id
            }).toArray()
        } else {
            return new Array()
        }
    }
}

function YoutubePlayer(ytp, pla) {
    this.ytp
    this.pla = pla

    if (ytp != null) {
        this.setPlayer(ytp)
    }

    this.setPlayer = function (ytp) {
        if (ytp != null) {
            this.ytp = ytp
            this.playVideoDiv(this.pla.currSong)
        }
    }

    this.drawPlayer = function (appendToElementId) {
        this.pla.currSong = this.pla.playlist[0]
        var videoFeed = $(this.pla.currSong).data("videoFeed")
        var params = { allowScriptAccess:"always", allowFullScreen:"true" };
        var atts = { id:"ytplayer" };
        var playerWidth = ytPlayerHolder.width() - 9
        swfobject.embedSWF("http://www.youtube.com/v/" + videoFeed.id + "?enablejsapi=1&playerapiid=ytplayer&version=3", appendToElementId, parseInt(playerWidth), parseInt(playerWidth / 1.19), "8", null, null, params, atts);
    }

    this.resizePlayer = function (ytPlayerHolder) {
        var playerWidth = ytPlayerHolder.width()
        var playerHeight = parseInt(playerWidth / 1.19)
        var ytplayer = $('#ytplayer')
        ytplayer.width(playerWidth)
        ytplayer.height(playerHeight)
    }

    this.playVideoDiv = function (videoDiv) {
        $(this.pla.currSong).removeClass("selected")
        this.pla.currSong = videoDiv
        $(this.pla.currSong).addClass("selected")
        var videoFeed = $(videoDiv).data('videoFeed')
        document.title = windowId + ' - ' + videoFeed.title
        this.playVideoFeed(videoFeed)
    }

    this.playVideoFeed = function (videoFeed) {
        var videoId = videoFeed.id
        this.ytp.loadVideoById(videoId)
    }

    this.playNextVideo = function () {
        this.playVideoDiv(this.pla.lookupNextSong(this.pla.currSong))
    }

    this.onStateChange = function (state) {
        console.log("change " + state)
        if (state == 0) {
            this.playNextVideo()
        }
    }
}

function GUID() {
    var S4 = function () {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };

    return (
        S4() + S4()
        );
}


var setSlimScroll = function (elementExpression, height) {
    $(elementExpression).slimScroll({
        height:height,
        color:'rgb(0, 50, 255)',
        railVisible:true,
        railColor:'#000000',
        disableFadeOut:true
    });
}
function convert(duration) {
    var tbl = [
        [ 7 * 24 * 60 * 60, 'week' ],
        [ 24 * 60 * 60, 'day' ],
        [ 60 * 60, 'hour' ],
        [ 60, 'minute' ],
        [ 1, 'second' ]
    ];
    var t = parseInt(duration);
    var r = '';
    var out = [];
    for (var i = 0; i < tbl.length; i++) {
        var d = tbl[i];
        if (t > d[0]) {
            var u = Math.floor(t / d[0]);
            t -= u * d[0];
            u < 10 ? out.push('0' + u) : out.push(u)
        } else if (i >= 3) {
            out.push('00')
        }
    }
    return out.join(":")
}

Array.prototype.unique =
    function () {
        var a = [];
        var l = this.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                // If this[i] is found later in the array
                if (this[i] === this[j])
                    j = ++i;
            }
            a.push(this[i]);
        }
        return a;
    };