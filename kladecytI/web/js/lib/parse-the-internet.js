'use strict';

function ParseTheInternet(targetRegex) {
    var parseTheInternet;

    AnilandParser.target = 'extension';
    SoundCloudParser.target = 'web';
    VimeoParser.target = 'web';
    YouTubeParser.target = 'web';

    parseTheInternet = {
        parsers: [AnilandParser, SoundCloudParser, VimeoParser, YouTubeParser]
            .filter(function (parser) {
                return targetRegex.test(parser.target);
            })
            .map(function (parser) {
                return parser()
            }),
        parse: function (text, opts) {
            var links, result, typeIds, parser, matched;

            result = [];
            links = text.match(parseTheInternet.matchAllRegex);
            typeIds = links.map(function (link) {
                for (var i = 0; i < parseTheInternet.parsers.length; i++) {
                    parser = parseTheInternet.parsers[i];
                    if (matched = parser.matcher(link)) {
                        return matched;
                    }
                }
            });

            return typeIds;
        }
    };
    parseTheInternet.matchAllRegex = (function () {
        var concatRegex;

        concatRegex = parseTheInternet.parsers.map(function (parser) {
            var regex;

            regex = parser.regex.toString();
            //HINT: remove '/' regex wrappers and wrap in group '()'
            return "(" + regex.toString().substring(1, regex.length - 1) + ")"
        }).join("|");

        return new RegExp(concatRegex, "g");
    })();

    return parseTheInternet;

    function AnilandParser() {
        var anilandParser;

        anilandParser = {
            regex: /videoUpdate\((\d+)[^"]+"><span>([^<]+)<\/span>/,
            matcher: function (aPart) {
                var id, title, url, typeId, matched;

                matched = aPart.match(anilandParser.regex);
                id = matched[1];
                title = matched[2];
                url = "http://mp4.aniland.org/" + id + ".mp4";
                typeId = _.TypeId("w", url);

                if (title) {
                    typeId.set({
                        title: title,
                        origin: window.location.href
                    });
                    typeId.localSave();
                    typeId.storeSave();
                }

                return typeId.raw()
            }
        };

        return anilandParser;
    }

    function SoundCloudParser() {
        var soundCloudParser;

        soundCloudParser = {
            regex: /((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<>]+)/
        };
        soundCloudParser.matcher = matchGroup(soundCloudParser.regex, 5, 's');

        return soundCloudParser;
    }

    function VimeoParser() {
        var vimeoParser;

        vimeoParser = {
            regex: /vimeo.com\\?\/((video\/)|(moogaloop.swf\?.*clip_id=))?(\d+)/
        };
        vimeoParser.matcher = matchGroup(vimeoParser.regex, 4, 'v');

        return vimeoParser;
    }

    function YouTubeParser() {
        var youTubeParser;

        youTubeParser = {
            regex: /(youtu.be(\\?\/|\u00252F)|watch(([^ \'\'<>\r\n]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\'<>\/\\.,#]{11})/
        };
        youTubeParser.matcher = matchGroup(youTubeParser.regex, 11, 'y');

        return youTubeParser;
    }

    function matchGroup(regex, group, prefix) {
        return function (link) {
            var matched, id;

            if (matched = link.match(regex)) {
                if ((id = matched[group]) != undefined) {
                    return {
                        type: prefix,
                        id: id
                    }
                }
            }
        }
    }
}
