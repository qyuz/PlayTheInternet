'use strict';

function ParseTheInternet() {
    var parseTheInternet;

    parseTheInternet = {
        _parsers: [],
        _globalRegex: null,
        addParser: function (parser) {
            parseTheInternet.addParsers([parser]);
        },
        addParsers: function (parsers) {
            parseTheInternet._parsers = parseTheInternet._parsers.concat(parsers);
            parseTheInternet._globalRegex = globalRegex(parseTheInternet._parsers);
        },
        parse: function (text, opts) {
            var matchedGlobal, typeIds, result, parser, typeId, parseText;

            result = [];
            opts = opts || {};
            if (opts.origin) {
                parseText = opts.origin + " " + text;
            } else {
                parseText = text;
                opts.origin = window.location.href;
            }
            matchedGlobal = parseText.match(parseTheInternet._globalRegex);
            if (matchedGlobal != null) {
                typeIds = matchedGlobal.map(function (matchedText) {
                    for (var i = 0; i < parseTheInternet._parsers.length; i++) {
                        parser = parseTheInternet._parsers[i];
                        if (typeId = parser.matcher(matchedText, opts)) {
                            return typeId;
                        }
                    }
                });
                result = uniqueTypeIds(typeIds);
            }

            return result;
        },
        parseToString: function(text, opts) {
            var typeIds, links;

            typeIds = parseTheInternet.parse(text, opts);
            links = typeIds.map(function(typeId) {
                return typeId.type + "=" + typeId.id;
            }).join(",");

            return links
        }
    };

    parseTheInternet.addParsers([YouTubeParser(), SoundCloudParser(), VimeoParser()]);

    return parseTheInternet;

    function SoundCloudParser() {
        var soundCloudParser, simpleMatcher;

        soundCloudParser = {
            regex: /((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<>]+)/
        };
        simpleMatcher = matchGroup(soundCloudParser.regex, 5, 's');
        soundCloudParser.matcher = function (matchedText) {
            var typeId;

            typeId = simpleMatcher(matchedText);
            if (typeId) {
                typeId.id = typeId.id
                    .replace(/[\\()]/g, '')
                    .replace(/\u00252F/g, '/')
                    .replace(/\u00253F((fb_action)|(utm_source)).*/, '');

                return typeId;
            }
        };

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
            regex: /(youtu.be(\\?\/|\u00252F)|watch(([^ \'\"<>\r\n]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\"<>\/\\.,#]{11})/
        };
        youTubeParser.matcher = matchGroup(youTubeParser.regex, 11, 'y');

        return youTubeParser;
    }

    function globalRegex(parsers) {
        var concatRegex;

        concatRegex = parsers.map(function (parser) {
            var regex;

            regex = parser.regex.toString();
            return "(" + regex.toString().substring(1, regex.length - 1) + ")"
        }).join("|");

        return new RegExp(concatRegex, "g");
    }

    function matchGroup(regex, group, prefix) {
        return function (matchedText) {
            var matched, id;

            if (matched = matchedText.match(regex)) {
                if ((id = matched[group]) != undefined) {
                    return {
                        type: prefix,
                        id: id
                    }
                }
            }
        }
    }

    function uniqueTypeIds(typeIds) {
        var reduced, typeIdString;

        reduced = typeIds.reduce(function (memo, typeId) {
            typeIdString = typeId.type + "=" + typeId.id;
            if (!memo.map[typeIdString]) {
                 memo.uniqueTypeIds.push(typeId);
            }
            memo.map[typeIdString] = 1;
            
			return memo;
        }, {
            uniqueTypeIds: [],
            map: Object.create(null)
        });

        return reduced.uniqueTypeIds;
    }
}
