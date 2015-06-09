'use strict';

define(["pti-playlist"], function(Playlist) {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            var typeIdsString;

            if (request.operation == "parsedPlaylist") {
                typeIdsString = window.parseTheInternet.parseToString(request.html, {
                    origin: request.href
                });
                window.parsedPlaylist._emptyContent();
                $('#parsedDiv>#parsedError').remove();
                if (typeIdsString.length) {
                    parsedPlaylist.addElements(_.stringToArray(typeIdsString));
                } else {
                    $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound(request));
                }
            }
        }
    );
    window.parsedPlaylist = new Playlist('#parsedPlaylist', {
            connectWith: "connected-playlist",
            headerConfigKey: "lConfigParsedPlaylistHeader",
            quickPlay: _.partial(Playlist.prototype.createPlaylist, 'qPlaylist', 'Quick Play', true),
            execute: [
                Playlist.prototype.addAction,
                function() {
                    this.tabsGetPlaylist = tabs.second.getPlaylist
                }
            ]
        }
    );
    chrome.tabs.executeScript(null, {file: "/js/app/popup/parsePage.js"}, function (parse) {
        _.isUndefined(parse) && $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound({href: window.location.href}));
    });
});
