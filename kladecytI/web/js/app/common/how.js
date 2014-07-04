define(["pti-playlist"], function (Playlist) {
    Playlist.prototype._setSlimScroll('#howDivContainer', '100%')
    $('#howDivContainer').on('click', '.temp-panel-heading-how', function () {
//        console.log(this)
        var $how = $(this), $contentSiblings = $how.siblings()
        if ($contentSiblings.length == 0) {
            $how.addClass('selected')
            var videoId = $how.attr('pti-video'), $el = $('<div class="temp-how-item"> <iframe width="560" height="315" src="http://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe> </div>').hide()
            $how.after($el)
            $el.show(150)
        } else {
            $how.removeClass('selected')
            $contentSiblings.hide(400, function () {
                $contentSiblings.remove()
            })
        }
    })
})