'use strict';

define(["pti-playlist", "cparse"], function(Playlist) {
    var backgroundWindow;

    backgroundWindow = chrome.extension.getBackgroundPage();

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            var parseText, typeIds;
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
            if (request.greeting == "hello")
                sendResponse({farewell:"goodbye"});
            if (request.operation == "parsedPlaylist") {
                request.data != '' ? parsedPlaylist.addElements(_.stringToArray(request.data)) : $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound(request))
            } else if(request.operation == "parsePlayTheInternetParseFunctionMissing") {
                $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing(request))
            }
            if (request.operation == "parsePage") {
                parseText = request.href;
                parseText += request.html;
                backgroundWindow.parseTheInternet.parse(parseText);
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
    window.parsedPlaylist._emptyContent();
    chrome.tabs.executeScript(null, {file: "/js/app/popup/parsePage.js"}, function (parse) {
        _.isUndefined(parse) && $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound({href: window.location.href}))
    });
})
