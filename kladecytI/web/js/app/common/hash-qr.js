define(['underscore', 'app/common/tabs'], function (_) {
    function buildQR() {
        if (!_.isUndefined(playlist)) {
            var untrimmed = playlist.buildHash().substr(0, 2006)
            var location = 'http://playtheinter.net/play.html' + untrimmed.substr(0, untrimmed.lastIndexOf(','))
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
        }
    }

    function redrawHashAndQRCode() {
        if (typeof playlist != "undefined") {
            window.location.hash = playlist.jPlaylist.sortable('toArray')
            $('#buildHashInput').val('http://playtheinter.net/play.html' + playlist.buildHash())
            $('#longLinkA').attr('href', 'http://playtheinter.net/play.html' + playlist.buildHash())
        }
        if ($("#tabs").tabs("option", "active") == 2) {
            require(['qrcode'], function () {
                buildQR()
            })
        }
    }

    return redrawHashAndQRCode
})
