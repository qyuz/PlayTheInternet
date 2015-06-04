define(["underscore-core"], function() {
    var underscore_mixin, storeTheInternet;

    underscore_mixin = {
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
        openPanel: function() {
            chrome.windows.create({
                url: 'panel.html',
                height: 93,
                width: 410,
                type: 'panel'
            })
        },
        setWindowTitle: function(typeId) {
            try {
                window.document.title = JSON.parse(localStorage.getItem(typeId.id)).title
            } catch (e) {
                window.document.title = typeId.id
            }
        },
        StoreTheInternet: StoreTheInternet,
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
        typeId: function(a, b) {
            if(_.isArguments(a)) {
                b = a[1]
                a = a[0]
            }
            if (a && a.type && a.id) {
                return a
            } else if (_.isString(a) && _.isString(b)) {
                return { type: a, id: b }
            } else if (a) {
                return underscore_mixin.stringToTypeId(a)
            } else {
                console.log("Couldn't determine typeId", a, b)
                throw "Couldn't determine typeId, check log"
            }
        },
        TypeId: TypeId,
        typeIdToString: function(typeIdObj) {
            return typeIdObj.type && typeIdObj.id ? typeIdObj.type + "=" + typeIdObj.id : ""
        }
    };

    storeTheInternet = StoreTheInternet();
    _.mixin(underscore_mixin);

    function StoreTheInternet() {
        var storeTheInternet, timeout;

        storeTheInternet = {
            _bulk: [],
            save: function(obj) {
                var docs;

                if (arguments.length) {
                    docs = [doc(obj)];
                } else if (storeTheInternet._bulk.length) {
                    docs = storeTheInternet._bulk;
                    storeTheInternet._bulk = [];
                }

                $.ajax(window.PTISTS.STORE_THE_INTERNET + '/_bulk_docs', {
//                        new_edits: false,
                    data: JSON.stringify({
                        docs: docs
                    }),
                    contentType: 'application/json',
                    type: 'post'
                });
            },
            saveDebounce: function (obj) {
                var storeDoc;

                storeDoc = doc(obj);
                storeTheInternet._bulk.push(storeDoc);
                clearTimeout(timeout);
                timeout = setTimeout(storeTheInternet.save, 1);
            }
        };

        return storeTheInternet;

        function doc(obj) {
            return {
                _id: obj.id,
//                    _rev: '1-1ed613e7542be61d8de28aa3ae079279',
                created: Date.now(),
                data: obj
            }
        }
    }

    function TypeId(a, b) {
        var typeId;

        typeId = {
            _data: _.typeId(a, b),
            localLoad: function() {
                var itemString, item;

                itemString = localStorage.getItem(typeId._data.id);
                if (itemString) {
                    try {
                        item = JSON.parse(itemString);
                        typeId.set(item);
                    } catch (e) {
                        console.log('Unable to load TypeId - Malformed JSON: [' + typeId._data.id + ']');
                    }
                }
            },
            localSave: function() {
                try {
                    localStorage.setItem(typeId._data.id, JSON.stringify(typeId._data));
                } catch (e) {
                    console.log('Unable to save TypeId - Malformed JSON: [' + typeId._data.id + ']');
                }
            },
            raw: function() {
                return {
                    type: typeId._data.type,
                    id: typeId._data.id
                }
            },
            storeLoad: function() {
            },
            storeSave: function() {
                storeTheInternet.saveDebounce(typeId._data);
            },
            set: function(properties) {
                typeId._data = _.extend(typeId._data, properties);
            }
        };

        return typeId;
    }
});
