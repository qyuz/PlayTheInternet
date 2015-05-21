define(["underscore"], function (a) {
    function buildQR() {
        if (window.playlist) {
            var playlistHash = window.playlist.buildHash(), location = 'http://playtheinter.net/play.html'
            if(playlistHash.length > 2006) {
                var untrimmed = playlistHash.substr(0, 2006)
                location += untrimmed.substr(0, untrimmed.lastIndexOf(','))
            } else {
                location += playlistHash
            }
            $.ajax({
                url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAiX6mvD7nSnqcW0vXwapLMd9UCXwa4mis',
                type: 'post',
                contentType: 'application/json',
                data: '{"longUrl":"' + location + '"}',
                success: function () {
                    console.log(arguments);
                    $('#qrcode').empty();
                    $('#qrcode').qrcode(arguments[0].id)
                    $('#shortBuildHashInput').val(arguments[0].id)
                    $('#shortLinkA').attr('href', arguments[0].id)
                },
                error: function () {
                    console.log('buildqr error');
                    console.log(arguments)
                }
            })
            setFullURLs()
        }
    }

    var $fullURLsTitle = $('#fullURLsTitle').click(setFullURLs), $fullURLsTab = $('#fullURLsTab').click(setFullURLs)
    function setFullURLs() {
        $('#fullURLsInput').text(window.playlist.getIds().map(_.stringToTypeId).map(function(typeId) {
            var output = SiteHandlerManager.prototype.fullURL(typeId.type, typeId.id);
            if($fullURLsTitle.prop('checked')) {
                try {
                    var title = JSON.parse(localStorage.getItem(typeId.id)).title
                    output += $fullURLsTab.prop('checked') ? String.fromCharCode(9) : ' '
                    output += title
                } catch (e) {}
            }
            return output
        }).join('\r\n'))
    }

    function setFullURL(type, id) {
        var fullURL = SiteHandlerManager.prototype.fullURL(type, id), templateUrl = fullURL
        $('#fullURLInput').val(fullURL)
        $('#fullURLLinkA').attr('href', fullURL)
        $('#templateInput').val(templateUrl)
        $('#templateLinkA').attr('href', templateUrl)
    }

    function redrawHashAndQRCode() {
        if (window.playlist && window.playerWidget) {
            window.location.hash = window.playlist.getIds()
            var _pti = window.playerWidget.data.listenObject;
            _pti.data.currentPlayer && _pti.data.videoId && setFullURL( _pti.data.currentPlayer, _pti.data.videoId )
            $('#buildHashInput').val('http://playtheinter.net/play.html' + window.playlist.buildHash())
            $('#longLinkA').attr('href', 'http://playtheinter.net/play.html' + window.playlist.buildHash())
        }
        if ($('#tabs').find('.ui-state-active').text().trim() == "Share") {
            require(["qrcode"], function () {
                buildQR()
            })
        }
    }

    return { redraw: redrawHashAndQRCode, setFullURL: setFullURL }
})
