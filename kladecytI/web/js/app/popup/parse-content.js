chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell:"goodbye"});
        if (request.operation == "parsedPlaylist") {
            if(request.data == ''){
                $('#parsedDiv').html(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound(request))
            } else {
                chrome.storage.local.get(['parseHeaderOptions'], function (options) {
                    options = prepareOptions(options, { size: 'list', split: 'one'})
                    window.parsedPlaylist = new Playlist('#parsedPlaylist', {
                            elementSize: options.size,
                            elementSplit: options.split,
                            headerClick: headerClick.bind({parseHeaderOptions: {}}),
                            execute: [
                                function () {
                                    var self = this
                                    this.jPlaylist.on('click', '.pti-element-song', function (event) {
                                        if ($(event.target).prop('tagName').match(/^[aA]$/) == null) {
                                            var selected = new Array()
                                            var uiselected
                                            selected.push(this.id)
//                                            console.log(selected)
                                            var $this = $(this)
                                            $this.hasClass('ui-selected') && ( uiselected = self.jPlaylist.find('.ui-selected').each(function() {
                                                selected.push($(this).attr('id'))
                                            }))
//                                            console.log(selected)
                                            selected = selected.join(',')
                                            playlist.addSongsToPlaylist(playlist.parseSongIds(selected), true)
                                            $this.remove()
                                            uiselected && uiselected.remove()
                                        }
                                    })
                                }
                            ]
                        }
                    );
                    parsedPlaylist.playlistEmpty();
                    parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data))
                })
            }
        } else if(request.operation == "parsePlayTheInternetParseFunctionMissing") {
            $('#parsedDiv').html(PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing(request))
        }
    }
);
chrome.tabs.executeScript(null, {file: "/js/app/popup/parsePage.js"}, function (parse) {
    _.isUndefined(parse) && $('#parsedDiv').html(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound({href: window.location.href}))
});