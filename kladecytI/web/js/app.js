requirejs.config({
    "baseUrl":"js/lib",
	"waitSeconds":0,
    "paths":{
        "app":"../app",
        "jquery":"common/jquery-2.0.3.min",
        "jquery-ui":"common/jquery-ui-1.10.4.custom.min",
        "jquery-jobbing":"common/jquery-jobbing",
        "underscore-core":"common/lodash-min",
        "underscore":"common/underscore-mixin",
        "jstorage":"common/jstorage.min",
        "sitehandlers":"SiteHandlers",
        "pti-playlist":"common/playlist",
        "slimscroll":"common/jquery.slimscroll",
        "qrcode":"common/jquery.qrcode",
        "qrcode-core":"common/qrcode-core",
        "youtube-api":"https://www.youtube.com/iframe_api?lol",
        "require":"common/require",
        "soundcloud-api":"common/sc-api",
        "vimeo-api":"common/vim-froogaloop2.min",
        "jasmine":"jasmine/jasmine",
        "jasmine-html":"jasmine/jasmine-html",
        "jasmine-runner":"jasmine/spec_runner"
    },
    "shim":{
        "jquery-ui":["jquery"],
        "jstorage":["jquery"],
        "sitehandlers":["jquery", "underscore", "jstorage", "ctemplates"],
        "pti-playlist":["sitehandlers", "ctemplates"],
        "slimscroll":["jquery-ui"],
        "qrcode":["jquery", "qrcode-core"],
        "parse":["sitehandlers"]
    }
});

window.PTINTS = {
    STORE_THE_INTERNET: 'https://qyuz.cloudant.com/playtheinternet'
};

function upgradeRun(module) {
    require(["jstorage"], function() {
        var currVersion = parseFloat($.jStorage.get('manifest_version') || 0)

        var upgrade = null

        if(currVersion < 0.64 && module == EXTENSION) {
            var e064 = $.Deferred()
            $.when(upgrade).then(function() {
                console.log('initializing upgrade to 0.64')
                require(["app/migrate/064"], function() {
                    console.log('done upgrading to 0.64')
                    e064.resolve()
                })
                return e064
            })
            upgrade = e064
        }
        if(currVersion < 0.67 && module == EXTENSION) {
            var e067 = $.Deferred()
            $.when(upgrade).then(function() {
                console.log('initializing upgrade to 0.67')
                require(["app/migrate/067"], function() {
                    console.log('done upgrading to 0.67')
                    e067.resolve()
                })
                return e067
            })
            upgrade = e067
        }
        if(currVersion < 0.68 && module == WEB) {
            var w068 = $.Deferred()
            $.when(upgrade).then(function() {
                console.log('initializing upgrade to 0.68')
                require(["app/migrate/w068"], function() {
                    console.log('done upgrading to 0.68')
                    w068.resolve()
                })
                return w068
            })
            upgrade = w068
        }
        $.when(upgrade).then(function () {
            $.when($.getJSON('/manifest.json')).then(function (manifest) {
                try {
                    var manifestVersion = manifest.version.replace(/^(\d+\.\d+)(\..*)?/, '$1')
                    $.jStorage.set('manifest_version', manifestVersion)
                    console.log('ran')
                    requirejs([module])
                } catch (e) {
                    alert("Failed to set manifest version\r\n" + e)
                }
            }).fail(function () {
                alert("Failed to get manifest file, due to connectivity error or magic. Please refresh.\r\n")
            })
        })
    })
}

var WEB = "app/web", EXTENSION = "app/background";

// Load the main app module to start the app
var href = window.location.href;
if (typeof chrome == "undefined" || !chrome.extension) {
    if(href.match('play.html')) {
        upgradeRun(WEB)
    } else if(href.match('iframe-player')) {
        requirejs(["app/iframe-player"])
    } else if(href.match('parse')) {
        requirejs(["app/parse"])
    } else if(href.match('index')) {
        requirejs(["app/index"])
    } else if(href.match('jasmine')) {
        requirejs(["app/jasmine"])
    } else {
        requirejs(["app/index"]);
    }
} else if (chrome.extension.getBackgroundPage() == window) {
    upgradeRun(EXTENSION)
} else {
    if (href.match('panel')) {
        requirejs(["app/panel"])
    } else {
        requirejs(["app/popup"])
    }
}
