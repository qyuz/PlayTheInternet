define(["underscore-core"], function() {
    _.mixin({
        arrayToString: function (arr) {
            return arr.map(function (item) {
                return item.replace(/(,)/g, "\\$1")
            }).join(",")
        },
        default: function (input, def) {
            return _.isUndefined(input) ? def : input
        },
        formatDuration: function(duration) {
            var t = parseInt(duration)
            if(t) {
                var seconds = function(s) { return s % 60 }
                var minutes = function(s) { return (s / 60) % 60}
                var hours = function(s) { return s / (60 * 60)}
                var m = function(i) { return Math.floor(i) }
                var f = function(s) { return ("0" + s).slice(-2) }
                var sec = m(seconds(t))
                var min = m(minutes(t))
                var hours = m(hours(t))
                var fHours = (f(hours) + ":"), fHours = fHours != "00:" ? fHours : ""
                return fHours + f(min) + ":" + f(sec)
            } else {
                return "00:00"
            }
        },
        guid: function () {
            var S4 = function () {
                return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
            };
            var now = Date.now().toString(), preNow = now.substring(0, now.length - 6)
            return (
                preNow + S4() + S4() + _.uniqueId()
                );
        },
        getPti: function() {
            var _pti = typeof window.pti === "undefined" ? chrome.extension.getBackgroundPage().pti : window.pti
            return _pti
        },
        stringToArray: function (string) {
            var resultArray = string ? string.replace(/\\,/g, "&thisiscomma;").split(/,/).map(function (item) {
                return item.replace(/&thisiscomma;/g, ',')
            }) : []
            return resultArray
        },
        stringToTypeId: function(typeIdText) {
            var pattern = /([^=])=(.*)/
            var typeIdObj = { type: typeIdText.replace(pattern, '$1'), id: typeIdText.replace(pattern, '$2') };
            return typeIdObj
        },
        typeIdToString: function(typeIdObj) {
            return typeIdObj.type && typeIdObj.id ? typeIdObj.type + "=" + typeIdObj.id : ""
        }
    })
})