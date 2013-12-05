define(function() {
    function parseText(concat) {
        require(['cparse'], function () {
            var ids = playTheInternetParse(concat);
            console.log(ids)
            addToPlaylist(ids)
        })
    }

    function addToPlaylist(ids) {
        var links = []
        ids.length && (links = playlist.parseSongIds(ids)) | playlist.addSongsToPlaylist(links, true)
        notify(links)
    }

    function notify(links) {
        if (links && links.length) {
            chrome.notifications.create('', {
                type: "basic",
                title: "Found " + links.length + " track" + (links.length > 1 ? "s" : "") + "!",
                message: "Adding tracks to PlayTheInternet. Remember that duplicate tracks won't be added!",
                iconUrl: "favicon.ico"
            }, function () {
                console.log()
            })
        } else {
            chrome.notifications.create('', {
                type: "basic",
                title: "Nothing!",
                message: "Couldn't find tracks.",
                iconUrl: "/css/resources/nothing.png"
            }, function () {
                console.log()
            })
        }
    }

    function parseTextHandler(info, tab) {
        console.log("item " + info.menuItemId + " was clicked");
        var concat = info.linkUrl;
        console.log(JSON.stringify(info) + '\r\n' + JSON.stringify(tab));
        parseText(concat);
    }

    function parsePageHandler() {
        console.log(chrome.tabs)
        chrome.tabs.executeScript(null, {file: "/js/app/background/parsePageHandler.js"}, function(executeSuccess) {
            _.isUndefined(executeSuccess) && notify()
        })
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.operation == "parsePageHandler") {
                console.log(request.data)
                addToPlaylist(request.data)
            } else if(request.operation == "parsePageParsePlayTheInternetParseFunctionMissing") {
                chrome.notifications.create('', {
                    type: "basic",
                    title: "Refresh this tab!",
                    message: "Please refresh(F5) current tab:\r\n" + request.href,
                    iconUrl: "/css/resources/nothing.png"
                }, function () {
                    console.log()
                })
            }
        }
    );

    chrome.contextMenus.create({"title": 'Add link to PlayTheInternet', "contexts":['link'], "onclick": parseTextHandler});
    chrome.contextMenus.create({"title": 'Add selected text to PlayTheInternet', "contexts":['selection'], "onclick": parseTextHandler});
    chrome.contextMenus.create({"title": 'Add everything from this page', "contexts":['page'], "onclick": parsePageHandler});
})
