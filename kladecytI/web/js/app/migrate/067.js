define(["jstorage", "underscore"], function(js, un) {
    function DAO(key) {
        var obj = $.jStorage.get(key)
        var storageObj = _.extend({ id: key }, obj)
        storageObj.data = _.stringToArray(storageObj.data)
        return dao = {
            key: key,
            storageObj: storageObj,
            delete: function() {
                $.jStorage.deleteKey(this.key)
                $.jStorage.deleteKey("selected_" + this.key)
                return this
            }
        }
    }

    var copyPlaylists = $.jStorage.index().filter(function(playlistId) {
        return playlistId.match(/^(backgroundPageId|dPlaylist.*)/)
    })

    copyPlaylists.forEach(function(playlistId) {
        var playlist = $.jStorage.get(playlistId)
        playlist.id = "lPlaylist" + _.guid()
        playlistId == "backgroundPageId" && (playlist.name = "Playing") && $.jStorage.set('playingId', playlist.id)
        $.jStorage.set(playlist.id, playlist)
        DAO(playlistId).delete()
    })
    DAO("devices").delete()
})