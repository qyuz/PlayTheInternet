function playTheInternetParseTemp(htmlText) {
    var unique = function (arr) {
        var newarr = [];
        var unique = {};

        arr.forEach(function (item) {
            item.id = item.id.replace(/[\\()]/g, '').replace(/\u00252F/g, '/')
                .replace(/\u00253F((fb_action)|(utm_source)).*/, '');
            if (!unique[item.id]) {
                newarr.push(item);
                unique[item.id] = item;
            }
        });
        return newarr;
    };
    if (htmlText == null) {
        htmlText = window.location.href + ' ';
        htmlText += document.documentElement.innerHTML;
    }
    var youtube = /thisisregex/g;
    var local = /thisisregex/;
    var youtubeLinks = htmlText.match(youtube);
    var result = new Array();
    if(youtubeLinks == null) {
        return '';
    }
    for (var i = 0; i < youtubeLinks.length; i++) {
        youtubeLinks[i].replace(local,
            "matchfunction"
        );
    }
    result = unique(result);
    var hash = '';
    result.forEach(function (item) {
        hash += item.type + '=' + item.id + ',';
    });
    hash = hash.slice(0, -1);
    return hash;
}

(function () {
    var regexs = _.map(siteHandlers,function (item) {
        var regex = String(item.__proto__.regex)
        //remove '/' regex wrappers and wrap in group '()'
        return("(" + regex.substring(1).substring(0, regex.length - 2) + ")")
    }).join("|")
    var matchFunction = "function(match) {"
    var lastGroupCount = 0;
    var ifs = _.map(siteHandlers,function (item, index) {
        var regex = String(item.__proto__.regex)
        var group = item.__proto__.regexGroup + index + 1 + lastGroupCount;
        var groupCount = regex.split('(').length - 1
        lastGroupCount = lastGroupCount + groupCount
        var prefix = item.__proto__.prefix;
        return "if(match.match(local)[" + group + "] != undefined) { result.push({type: '" + prefix + "', id:  match.replace(local, '$" + group + "')})}"
    }).join(';')
    matchFunction = matchFunction + ifs + '}'
    var playTheInternetParseString = String(playTheInternetParseTemp)
    playTheInternetParseString = playTheInternetParseString
        .replace(/thisisregex/g, regexs)
        .replace(/"matchfunction"/, matchFunction)
        .replace(/Temp/, '')
    console.log(playTheInternetParseString)
    window.playTheInternetParseString = playTheInternetParseString
    eval("window.playTheInternetParse = " + playTheInternetParseString)
})()