'use strict';

define(["underscore", "parse-the-internet"], function() {
    return ParseTheExtension;

    function ParseTheExtension() {
        var parseTheExtension;

        parseTheExtension = ParseTheInternet();
        parseTheExtension.addParsers([AnilandParser()]);

        return parseTheExtension;
    }

    function AnilandParser() {
        var anilandParser;

        anilandParser = {
            regex: /(videoUpdate\((\d+)[^>]+><span>([^<]+)<\/span>)|(mp4\.aniland.org\/(\d+)\.mp4)/,
            matcher: function (matchedText, opts) {
                var id, title, url, typeId, matched;

                matched = matchedText.match(anilandParser.regex);
                id = matched[2] || matched[5];
                title = matched[3];
                url = "http://mp4.aniland.org/" + id + ".mp4";
                typeId = _.TypeId("w", url);

                if (title) {
                    typeId.set({
                        title: title,
                        origin: opts.origin
                    });
                    typeId.localSave();
                    typeId.storeSave();
                }

                return typeId.raw()
            }
        };

        return anilandParser;
    }
})
