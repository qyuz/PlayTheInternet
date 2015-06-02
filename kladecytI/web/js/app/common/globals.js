define(["underscore", "jstorage"], function(a) {
    window.PTISTS = {
        STORE_THE_INTERNET: 'https://qyuz.cloudant.com/playtheinternet'
    };

    var storageVolume = $.jStorage.get('volume'), volume = _.isNumber(storageVolume) ? storageVolume : 100
    $.jStorage.set('volume', volume)
    var recycle = $.jStorage.get('rPlaylist')
    recycle || $.jStorage.set('rPlaylist', { name: 'Recycle' }) //defaultName not working yet with PlayerWidget Recycle button
})