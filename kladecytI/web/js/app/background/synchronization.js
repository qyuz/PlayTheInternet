define(['jstorage', 'underscore', 'pti-playlist'], function (one, two, Playlist) {
    var device_id = $.jStorage.get('device_id') || $.jStorage.set("device_id", _.guid())
    var upsertKeys = {}, deleteKeys = []

    var _jStorageListenerUpsert = _.throttle(function () {
        chrome.storage.sync.get(function (sync) {
            var start = Date.now()
            var upsert = {}
            console.trace("[%s] [_jStorageListenerUpsert][sync.get]", start, { sync: sync, synchronizeKeys: upsertKeys})
            for (var key in upsertKeys) {
                var dao = Playlist.prototype.DAO(key)
                delete(upsertKeys[key])
                if (dao.storageObj.updated > (sync[key] ? sync[key].updated : 0)) {
                    dao.update({ device_id: device_id }, false)
                    upsert[key] = dao.serialize().storageObj
                    console.trace("[%s] [_jStorageListenerUpsert][sync.get][dao.updated > sync.updated] [SET %s TO UPSERT]", start, key, { dao: dao.storageObj, sync: sync[key]})
                } else if (dao.storageObj.updated < sync[key].updated) {
                    dao.storageObj = sync[key]
                    dao.update({ source: "sync" }, false).set(false)
                    console.trace("[%s] [_jStorageListenerUpsert][sync.get][dao.updated<sync.updated] [OBJECT %s IN JSTORAGE OLDER THAN IN SYNC, UPDATED]", start, key, { dao: dao.storageObj, sync: sync[key]})
                }
            }
            if (_.keys(upsert).length) {
                chrome.storage.sync.set(upsert, function () {
                    chrome.runtime.lastError && (console.log(chrome.runtime.lastError) | alert(chrome.runtime.lastError.message + "\r\nOH NOES THERE WAS AN ERROR IN CHROME.SYNC.SET"))
                    console.trace("[%s] [_jStorageListenerUpsert][sync.set] [SYNCHRONIZED UPSERT TO CHROME.SYNC]", start, { upsert: upsert })
                })
            }
        })
    }, 8000)

    var _jStorageListenerDelete = _.throttle(function () {
        var tempDeleteKeys = deleteKeys
        chrome.storage.sync.remove(tempDeleteKeys, function () {
            console.trace("[%s] [_jStorageListenerDelete] [REMOVED DELETEKEYS FROM CHROME.SYNC]", Date.now(), tempDeleteKeys)
        })
        deleteKeys = []
    }, 14000)


    function _syncListenerUpsert(sync, key, log) {
        if (key.match(/^((synchronized|devices)|([ds]Playlist).*)/)) {
            var dao = Playlist.prototype.DAO(key)
            if (!sync[key]) {
//                dao.delete()
                console.trace("[%s] [chrome.storage.onChanged][sync.get][key.match][!sync] [REMOVED %s FROM JSTORAGE]", log, key, { sync: sync[key], dao: dao.storageObj })
            } else if (!dao.exists() || (sync[key].device_id != device_id && sync[key].updated > dao.storageObj.updated)) {
                dao.storageObj = sync[key]
                dao.update({ source: "sync" }, false)
                dao.set(false)
                console.trace("[%s] [chrome.storage.onChanged][sync.get][key.match][!dao.exists() || (sync.device_id != device_id && sync.updated > dao.updated)] [SET %s TO JSTORAGE]", log, key, { sync: sync[key], device_id: device_id, dao: dao.storageObj })
            }
        }
    }

    function init() {
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            if (namespace == "sync") {
                chrome.storage.sync.get(function (sync) {
                    var start = Date.now()
                    console.trace("[%s] [chrome.storage.onChanged][sync.get]", start, { changes: changes, sync: sync })
                    for (key in changes) {
                        _syncListenerUpsert(sync, key, start)
                    }
                })
            }
        });

        $.jStorage.listenKeyChange('backgroundPageId', function(key, action) {
            var playingPlaylist = Playlist.prototype.DAO(key), dPlaylistkey = "dPlaylist" + device_id, dPlaylist = Playlist.prototype.DAO(dPlaylistkey)
            var name = dPlaylist.storageObj.name //find more elegant solution
            dPlaylist.storageObj = playingPlaylist.storageObj
            dPlaylist.update({ id: dPlaylistkey, name: name, device_id: device_id }, false).set() //change id, name is temporary. find more elegant solution
        })

        $.jStorage.listenKeyChange('*', function (key, action) {
            if (key.match(/^((synchronized|devices)|([ds]Playlist).*)/)) {
                var dao = Playlist.prototype.DAO(key)
                if (!dao.exists()) {
                    deleteKeys.push(dao.key)
                    console.trace("[%s] [jStorageListenKeyChange(key.match(/^((synchronized)|(sPlaylist).*)/))&&!dao.exists] [SCHEDULED %s TO DELETEKEYS, INVOKING _jStorageListenerDelete]", Date.now(), key)
                    _jStorageListenerDelete()
                } else if (dao.storageObj.source != "sync") {
                    upsertKeys[key] = action
                    console.trace("[%s] [jStorageListenKeyChange(key.match(/^((synchronized)|(sPlaylist).*)/))&&dao.storageObj.source!=sync] [SET %s TO SYNCHRONIZEKEYS, INVOKING _jStorageListenerUpsert]", Date.now(), key)
                    _jStorageListenerUpsert()
                }
            }
        })
    }

    return { init: init, syncListenerUpsert: _syncListenerUpsert }
})