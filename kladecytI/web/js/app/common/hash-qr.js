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
                url: 'https://www.googleapis.com/urlshortener/v1/url',
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
            $('#fullURLsInput').text(window.playlist.getIds().map(_.stringToTypeId).map(SiteHandlerManager.prototype.fullURL).join('\r\n'))
        }
    }

    function setFullURL(typeId) {
        var fullURL = SiteHandlerManager.prototype.fullURL(typeId.type, typeId.id)
        $('#fullURLInput').val(fullURL)
        $('#fullURLLinkA').attr('href', fullURL)
    }

    function redrawHashAndQRCode() {
        if (window.playlist) {
            window.location.hash = window.playlist.getIds()
            var _pti = _.getPti()
            _pti.data.currentPlayer && _pti.data.videoId && setFullURL({ type: _pti.data.currentPlayer, id: _pti.data.videoId })
            $('#buildHashInput').val('http://playtheinter.net/play.html' + window.playlist.buildHash())
            $('#longLinkA').attr('href', 'http://playtheinter.net/play.html' + window.playlist.buildHash())
        }
        if ($('#tabs').find('.ui-state-active').text().trim() == "Options") {
            require(["qrcode"], function () {
                buildQR()
            })
        }
    }

    return { redraw: redrawHashAndQRCode, setFullURL: setFullURL }
})
