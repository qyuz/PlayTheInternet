
function playTheInternetParse(htmlText) {
    var unique = function (arr) {
        var newarr = [];
        var unique = {};
        arr.forEach(function (item) {
            item.id = item.id.replace(/[\\()]/g, "").replace(/\u00252F/g, "/").replace(/\u00253F((fb_action)|(utm_source)).*/, "");
            if (!unique[item.id]) {
                newarr.push(item);
                unique[item.id] = item;
            }
        });
        return newarr;
    };
    if (htmlText == null) {
        htmlText = window.location.href + " ";
        htmlText += document.documentElement.innerHTML;
    }
    var youtube = /((youtu.be(\\?\/|\u00252F)|watch(([^ \'\'<>\r\n]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\'<>\/\\.,#]{11}))|(((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<>]+))|(vimeo.com\\?\/((video\/)|(moogaloop.swf\?.*clip_id=))?(\d+))/g;
    var local = /((youtu.be(\\?\/|\u00252F)|watch(([^ \'\'<>\r\n]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\'<>\/\\.,#]{11}))|(((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<>]+))|(vimeo.com\\?\/((video\/)|(moogaloop.swf\?.*clip_id=))?(\d+))/;
    var youtubeLinks = htmlText.match(youtube);
    var result = new Array();
    if (youtubeLinks == null) {
        return "";
    }
    for (var i = 0; i < youtubeLinks.length; i++) {
        youtubeLinks[i].replace(local, function(match) {if(match.match(local)[12] != undefined) { result.push({type: 'y', id:  match.replace(local, '$12')})};if(match.match(local)[18] != undefined) { result.push({type: 's', id:  match.replace(local, '$18')})};if(match.match(local)[23] != undefined) { result.push({type: 'v', id:  match.replace(local, '$23')})}});
    }
    result = unique(result);
    var hash = "";
    result.forEach(function (item) {
        hash += item.type + "=" + item.id + ",";
    });
    hash = hash.slice(0, -1);
    return hash;
}

