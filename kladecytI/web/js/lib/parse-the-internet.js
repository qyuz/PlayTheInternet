'use strict';

AnilandParser.target = 'extension';
SoundCloudParser.target = 'web';
VimeoParser.target = 'web';
YouTubeParser.target = 'web';

function SiteParser(targetRegex) {
    var siteParser;

    siteParser = {
        parsers:[AnilandParser, SoundCloudParser, VimeoParser, YouTubeParser]
            .filter(function (parser) {
                return targetRegex.test(parser.target);
            })
            .map(function (parser) {
                return parser()
            }),
        parse:function (text, unique) {
            var links, result, typeIds, parser, matched;

            result = [];
            links = text.match(siteParser.matchAllRegex);
            typeIds = links.map(function (link) {
                for (var i = 0; i < siteParser.parsers.length; i++) {
                    parser = siteParser.parsers[i];
                    if (matched = parser.matcher(link)) {
                        return matched;
                    }
                }
            });

            return typeIds;
        }
    };
    siteParser.matchAllRegex = (function () {
        var concatRegex;

        concatRegex = siteParser.parsers.map(function (parser) {
            var regex;

            regex = parser.regex.toString();
            //HINT: remove '/' regex wrappers and wrap in group '()'
            return "(" + regex.toString().substring(1, regex.length - 1) + ")"
        }).join("|");

        return new RegExp(concatRegex, "g");
    })();

    return siteParser;
}

function AnilandParser() {
    var anilandParser;

    anilandParser = {
        regex:/videoUpdate\((\d+)[^"]+"><span>([^<]+)<\/span>/,
        matcher:function (aPart) {
            var id, title, url, matched;

            matched = aPart.match(anilandParser.regex);
            id = matched[1];
            title = matched[2];
            url = "http://mp4.anilang.org/" + id + ".mp4";

            anilandParser.store({
                _id: url,
                title: title,
                origin: window.location.href
            })

            return { 
                type: "mp4",
                id: url
            }
        },
        store:(function() {
            var docs, timeout;

            docs = [];
            return function (doc) {

                docs.push(doc);
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    $.ajax('https://qyuz.cloudant.com/playtheinternet/_bulk_docs', {
                        data: JSON.stringify({
                            docs: docs
                        }),
                        contentType: 'application/json',
                        type: 'post'
                    });
                    docs = []; //in success handler, retry otherwise
                }, 1);
            }
        })()
    };

    return anilandParser;
}

function SoundCloudParser() {
    var soundCloudParser;

    soundCloudParser = {
        regex:/((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<>]+)/
    };
    soundCloudParser.matcher = matchGroup(soundCloudParser.regex, 5, 's');

    return soundCloudParser;
}

function VimeoParser() {
    var vimeoParser;

    vimeoParser = {
        regex:/vimeo.com\\?\/((video\/)|(moogaloop.swf\?.*clip_id=))?(\d+)/
    };
    vimeoParser.matcher = matchGroup(vimeoParser.regex, 4, 'v');

    return vimeoParser;
}

function YouTubeParser() {
    var youTubeParser;

    youTubeParser = {
        regex:/(youtu.be(\\?\/|\u00252F)|watch(([^ \'\'<>\r\n]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\'<>\/\\.,#]{11})/
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