chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        details.requestHeaders.push({name: "Referer", value: "chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii/"})
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]);

//TODO strange vimeo player, check for seekTo and other methods 
http://vimeo.com/67160485#

_.flatten(_.reduce(sortedData, function (memo, item) {
    _.each(item.data, function (item) {
        item.date = this.meta.date
    }, item)
    memo.push(item.data);
    return memo
}, new Array()))

DPGlobal.parseDate($('#start').val(), DPGlobal.parseFormat('dd-mm-yyyy'))

--address=192.168.1.99

var matchTextRegExp = new RegExp("выборы", "gi")
var matchText = function(node) { return $(node).text().match(matchTextRegExp) != null ? true : false }
var selectMatched = function(node, matchText) { if(matchText(node)) { $(node).addClass('ui-selected') } }
_.each(calendarPlaylist.playlist, function(item) {  })

//TODO youtube parse
watch(([^ \'\'<>]+v=)|(\u0025253Fv\u0025253D))
http://www.youtube.com/attribution_link?a=YFxsWIwpFY035tQrnCYesw&u=%2Fwatch%3Fv%3D2O2Aec2o-4w%26feature%3Dshare

//TODO youtube not available in your country
http://www.youtube.com/watch?v=UdB76CMH4rM

//TODO sc secret token
http://www.nzherald.co.nz/entertainment/news/article.cfm?c_id=1501119&objectid=11138866

//TODO vimeo
http://noisey.vice.com/blog/meet-the-two-scottish-rappers-who-conned-the-world

//TODO exclude soundcloud
https://soundcloud.com/.../on-the-block-prod-by-boi-ape …

//TODO play button status highlight
    <div class="button play" style="
    /* background-color: black; */
"><div style="
    width: 39px;
    height: 39px;
    border-radius: 50%;
    background-color: black;
    position: relative;
    z-index: -1;
              "></div><div style="
    /* display: none; */
    width: 39px;
    height: 39px;
    background-color: white;
    position: absolute;
    z-index: -2;
    top: 0px;
"></div></div>

//TODO download logs
C:\java\jdks\appengine-java-sdk-1.7.3\bin>appcfg.cmd --num_days=2  request_logs "C:\java\svn\git\PlayTheInternet\kladecytI\out\artifacts\kladecyt_war_exploded" asdf.txt

//TODO flexible player
http://www.greensock.com/gsap-js/
window.duration = 600
window.tween = function() {
    var td = function() {
        return duration / 1000;
    }
    var $fv = $('#firstView');
    var fv = $fv.get()
    var $sv = $('#secondView');
    var sv = $sv.get();
    var $p = $('#players');
    var p = $p.get();
    $fv.unbind();
    $sv.unbind();

    $fv.on('mouseenter', function () {
        console.log('t')
        TweenLite.to(fv, td(), {width: '70%'})
        TweenLite.to(sv, td(), {width: '30%'})
    })
    $sv.on('mouseenter', function () {
        console.log('t')
        TweenLite.to(sv, td(), {width: '70%'})
        TweenLite.to(fv, td(), {width: '30%'})
    })
}

window.janimate = function() {
    var $fv = $('#firstView');
    var fv = $fv.get()
    var $sv = $('#secondView');
    var sv = $sv.get();
    var $p = $('#players');
    var p = $p.get();
    $fv.unbind();
    $sv.unbind();
    var $body = $('body');
    $fv.on('mouseenter', function () {
        console.log('j')
        $p.fadeOut(0)
        $fv.animate({'width': '70%'}, duration, function () {
            $p.fadeIn(duration)
        });
        $sv.animate({'width': '30%'}, duration)
    })
    $sv.on('mouseenter', function () {
        console.log('j')
        $sv.animate({'width': '70%'}, duration);
        $fv.animate({'width': '30%'}, duration)
    })
}

var back = $.jStorage.get('backgroundPageId')
var backSel = $.jStorage.get('backgroundPageId_selected')
$.jStorage.flush()
$.jStorage.set("backgroundPageId", back)
$.jStorage.set("backgroundPageId_selected", backSel)

var mB = JSON.stringify(localStorage).length / 1048576



function strcmp(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
function natcmp(a, b) {
    var x = [], y = [];

    a.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { x.push([$1 || 0, $2]) })
    b.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { y.push([$1 || 0, $2]) })

    while(x.length || y.length) {
        var xx = x.shift();
        var yy = y.shift();
        var nn = (xx[0] - yy[0]) || strcmp(xx[1], yy[1]);
        if(nn) return nn;
    }
    return 0;
}
new Array("one10", "one2").sort(natcmp)

var a = "http://playtheinter.net/play.html#,y=uH1wfrOcvHg,y=H05cAeD9LDc,y=T-D1KVIuvjA,y=1%3Bdc_yt%3,y=m%2526sourc,y=e,y=1;k,y=ptgQd5wYs1c,y=hrlqzTEbKuI,y=QrHEaptBvTU,y=5Qz2OpWLbYY,s=madeon/ellie-goulding-madeon,y=m-Al7GAnH8Q,y=dPAIYLK3HtI,y=b32KBbrdUoI,y=f0P8xt-O99M,y=xGKOyvDLiBY,y=qJ_MGWio-vc,y=rzlT-vw60tM,y=nAKrR_C-PB0,y=4YjJI_xfsFg,y=fQ07AfaKHKk,y=I1h2-MvtR3Y,y=leGGbaBya0s,y=uVXSXr8to9k,y=DmgviOd3d9c,y=vGGmbUPR5Qc,y=__videoid__,y=z-UJoY5WP5s,y=fTfcKhQkcSA,s=</span>,y=KYZzu36Vpws,y=TulVILhfxFM,y=JbNnoFe6NRQ,y=CKSNJ7oo87A,s=earabuse/invisible-earabuse-remix,y=VVXWE-xlp1k,y=u3TLf2pOA0I,y=LpiS3YiNBKg,y=h9hj9nTV2P4,y=H85BYqa5JDQ,y=pnIFcVJBgJI,y=miZLob1Hi4I,y=AYTnIigaJ5Y,y=-a3Hx1Ytmbo,s=timelock/timelock-ace-ventura-inside-us,y=rEKeHo5fLNM,y=4L72SeKcdrE,y=aHjpOzsQ9YI,y=xysko4j_Ntk,y=5BgQE3C4NS0,y=GLY4Rpii7bM,y=GwWOSdXeRqY,y=PTJel6kLBQQ,y=Mng7IEa7xkA,y=iw-b_VdpCEU,y=kwQOMdDmc4w,y=6mgNLE4GHvk,v=83480879,y=D8l,R7t\\,IoTiM"
a.replace(/(,)(?!\w=)/g, '\\$1').split(/[^\\],/).map(function(item) { return item.replace(/\\,/g, ',') })


http://0to255.com/E6E6FA
background-color: #e6e6fa;
background-color: #cacaf4;
background-color: #9f9fec;

PTITemplates.prototype.PlaylistCopyAction = _.template('<svg><polygon points="0,0 45,45 0,90"/></svg>')


$('.temp-create-playlist-name').eq(1).autocomplete({
    source: lPlaylists,
    minLength: 0
})
var cf = function() {  $('.temp-create-playlist-name').eq(1).focus().autocomplete("search", "") }

$('.pti-header').eq(1).click(function(e) {
    e.target == this && playlist.getPtiElements().removeClass('ui-selected')
})


localStorage.jStorageBackup = localStorage.jStorage
localStorage.jStorage_updateBackup = localStorage.jStorage_update

$.jStorage.deleteKey("manifest_version")
localStorage.removeItem("jStorage")
localStorage.removeItem("jStorage_update")

localStorage.jStorage = localStorage.jStorageBackup
localStorage.jStorage_update = localStorage.jStorage_updateBackup


    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />

.pti-ptilist .pti-header { background-color : #efefef; }
.pti-ptilist .pti-header .pti-header-button { transition: 0.3s ease; }
.pti-ptilist .pti-header .pti-header-button.selected { border-radius: 20%; }
.pti-ptilist .pti-header .pti-header-button:hover { background-color: cornflowerblue; color: aliceblue; border-radius: 30%; }

Player - facetime_video
Parse - inbox_out, log_out, new_window_alt
Text - file_export
Playlist - Albums, Playlist
Synchronized - cloud-upload
Options -
Help -

Chrome svg icon
<svg viewBox="0 0 39 39" version="1.1">  <path id="path2990" d="m19.553,26.659c-4.4168,0.18311-8.1275-4.5927-6.8212-8.8315,1.0146-4.1276,6.1839-6.5008,9.9559-4.4794,3.7464,1.7546,5.1788,7.0662,2.6017,10.372-1.3043,1.8099-3.4959,2.9687-5.7364,2.939zm2.9679,1.2458c-4.502,1.789-10.093-0.911-11.595-5.495-2.5094-4.534-5.1829-8.977-7.7607-13.473-4.9024,7.1879-3.9668,17.656,2.1,23.885,2.8686,3.042,6.7247,5.152,10.85,5.865,2.135-3.594,4.271-7.188,6.406-10.782zm14.644-17.021c-3.784-7.9357-13.356-12.468-21.901-10.443-4.301,0.94894-8.2797,3.3596-11.057,6.7859,2.1861,3.7681,4.3722,7.5371,6.558,11.306,0.45672-4.2201,4.3709-7.6849,8.6118-7.6485m0.09977,28.102c8.7283,0.15557,17.05-6.3241,18.977-14.851,0.91987-3.7885,0.6785-7.8563-0.7194-11.498h-12.827c3.8805,2.8681,4.5124,8.9715,1.4519,12.663-2.7581,4.4481-5.3294,9.018-8.0699,13.471,0.07293,0.4502,0.89423,0.08289,1.188,0.21539z"/></svg>
