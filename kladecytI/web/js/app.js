requirejs.config({
    "baseUrl":"js/lib",
	"waitSeconds":0,
    "paths":{
        "app":"../app",
        "bootstrap":"common/bootstrap.min",
        "jquery":"common/jquery-2.0.3.min",
        "jquery-ui":"common/jquery-ui-1.10.4.custom.min",
        "jquery-jobbing":"common/jquery-jobbing",
        "underscore-core":"common/lodash-min",
        "underscore":"common/underscore-mixin",
        "jstorage":"common/jstorage.min",
        "sitehandlers":"SiteHandlers",
        "playlist":"Utils",
        "pti-playlist":"common/playlist",
        "slimscroll":"common/jquery.slimscroll",
        "qrcode":"common/jquery.qrcode",
        "qrcode-core":"common/qrcode-core",
        "youtube-api":"https://www.youtube.com/iframe_api?lol",
        "require":"common/require",
        "soundcloud-api":"common/sc-api",
        "vimeo-api":"common/vim-froogaloop2.min",
        "datepicker":"common/bootstrap-datepicker",
        "base":"common/base",
        "jasmine":"jasmine/jasmine",
        "jasmine-html":"jasmine/jasmine-html",
        "jasmine-runner":"jasmine/spec_runner"
    },
    "shim":{
        "jquery-ui":["jquery"],
        "jstorage":["jquery"],
        "sitehandlers":["jquery", "underscore", "jstorage", "ctemplates"],
        "playlist":["sitehandlers", "slimscroll", "ctemplates"],
        "pti-playlist":["sitehandlers", "ctemplates"],
        "slimscroll":["jquery-ui"],
        "qrcode":["jquery", "qrcode-core"],
        "youtube-api":["player/iframe-youtube"],
        "datepicker":["jquery"],
        "parse":["sitehandlers"]
    }
});

function upgradeRun(module) {
    require(["jstorage"], function() {
        var currVersion = parseFloat($.jStorage.get('manifest_version') || 0)

        var deferred = $.Deferred()
        deferred.resolve()

        if(currVersion < 0.64) {
            var d064 = $.Deferred()
            deferred.then(function() {
                console.log('initializing upgrade to 0.64')
                require(["app/migrate/064"], function() {
                    console.log('done upgrading to 0.64')
                    d064.resolve()
                })
                return d064
            })
            deferred = d064
        }
        if(currVersion < 0.67) {
            var d067 = $.Deferred()
            deferred.then(function() {
                console.log('initializing upgrade to 0.67')
                require(["app/migrate/067"], function() {
                    console.log('done upgrading to 0.67')
                    d067.resolve()
                })
                return d067
            })
            deferred = d067
        }
        deferred.then(function() {
            try {
                var manifestVersion = chrome.runtime.getManifest().version.replace(/^(\d+\.\d+)(\..*)?/, '$1')
                $.jStorage.set('manifest_version', manifestVersion)
            } catch (e) {
                alert("Failed to set manifest version\r\n" + e)
            }
            console.log('ran')
            requirejs([module])
        })
    })
}

// Load the main app module to start the app
if (typeof chrome == "undefined" || !chrome.extension) {
    var href = window.location.href;
    if(href.match('play.html')) {
        upgradeRun("app/web")
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
    upgradeRun("app/background")
} else {
    if (window.location.href.match('panel')) {
        requirejs(["app/panel"])
    } else {
        requirejs(["app/popup"])
    }
}
