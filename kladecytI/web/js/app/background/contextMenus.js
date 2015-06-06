define(function() {
    function parseText(concat) {
        var typeIdsString = window.parseTheInternet.parseToString(concat);
        console.log(typeIdsString)
        addToPlaylist(typeIdsString)
    }

    function addToPlaylist(typeIdsString) {
        var links = []
        typeIdsString.length && (links = _.stringToArray(typeIdsString)) | playlist.addElements(links, true)
        notify(links)
    }

    var notifications = new Object();
    function notify(links) {
        if (links && links.length) {
            var notificationId = _.guid()
            notifications[notificationId] = links
            chrome.notifications.create(notificationId, {
                type: "basic",
                title: "Found " + links.length + " track" + (links.length > 1 ? "s" : "") + "!",
                message: "Adding tracks to PlayTheInternet. Remember that duplicate tracks won't be added!",
                iconUrl: "favicon.ico",
                buttons: [
                    {   title: 'Press here to start playing!',
                        iconUrl: "favicon.ico"
                    }
                ]
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
        var concat = info.linkUrl || info.selectionText;
        console.log(JSON.stringify(info) + '\r\n' + JSON.stringify(tab));
        parseText(concat);
    }

    function parsePageHandler() {
        console.log(chrome.tabs)
        chrome.tabs.executeScript(null, {file: "/js/app/background/parsePage.js"}, function(executeSuccess) {
            _.isUndefined(executeSuccess) && notify()
        })
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            var typeIdsString;

            if (request.operation == "parsePage") {
                typeIdsString = window.parseTheInternet.parseToString(request.html, {
                    href: request.href
                });
                console.log(typeIdsString)
                addToPlaylist(typeIdsString)
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
    chrome.notifications.onButtonClicked.addListener(function(notificationId) {
        try{
            var links = notifications[notificationId];
    //        console.log(links)
            playlist.playVideo(playlist.getVideoDivAndData({videoData: _.stringToTypeId(links[0])}))
        } catch(e) {
            chrome.notifications.create('', {
                type: "basic",
                title: "Unable to find track to play!",
                message: "Track is absent in playlist. Might be sick absence or was removed from playlist.",
                iconUrl: "/css/resources/nothing.png"
            }, function () {
                console.log()
            })
        }
    })
})
