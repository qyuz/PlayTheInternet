javascript: (function () {
    var postCount;
    function recalcPostCount() {
        postCount = $('.flat-list.buttons').length;
    }

    function recalcPostedVideosCount() {
        var ptiLinks = $('.usertext-body a').filter(function (i, item) {
            return $(item).attr('href') && $(item).attr('href').match(/http:\/\/playtheinter.net\/play.html/) && $(item).attr('href').match(/http:\/\/playtheinter.net\/play.html/).length;
        });
        ptiLinks.each(function (i, item) {
            var siblings = $(item).siblings(), countMatch = $(item).attr('href').match(/[=]/g), count = countMatch ? countMatch.length : 0;
            if (siblings.length) {
                $(siblings[0]).text(' ' + count + ' videos');
            } else {
                $(item).after('<a> ' + count + ' videos</a>');
            }
        })
    }

    function postPTIfy(postIndex) {
        if (postIndex < postCount) {
            updateStatus(postIndex);
            var post = $('.flat-list.buttons')[postIndex], $post = $(post);
            var commentHref = $(post).find('.first a:contains("comment")').attr('href');
            $.get(commentHref).success(function (data) {
                var $wd = $('<div>' + data + '</div>');
                $wd.find('h1:contains("RECENTLY VIEWED LINKS")').parent().parent().remove();
                var hash = '#' + playTheInternetParse($wd.html()), vcm = hash.match(/=/g), videoCount = vcm ? vcm.length : 0, href = 'http://playtheinter.net/play.html' + hash;
                debugger;
                if($post.find('a[href="' + href.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|@])/g,'\\$1') +'"]').length) {
                    console.log('duplicate')
                } else {
                    $post.append('<li><a href="' + href + '">' + videoCount + ' videos</a></li>');
                }
                setTimeout(function () {
                    postPTIfy(postIndex + 1);
                }, 2000)
            }).error(function (err) {
                console.log(err);
                $post.append('<li><a>error</a></li>');
                setTimeout(function () {
                    postPTIfy(postIndex + 1);
                }, 1000);
            })
        } else {
            updateStatus();
            setTimeout(function() {
                recalcPostCount();
                postPTIfy(0);
            }, 300000)
        }
    }

    function playTheInternetParse(htmlText) {
        var unique = function (arr) {
            var newarr = [];
            var unique = {};
            arr.forEach(function (item) {
                item.id = item.id.replace(/[\\()]/g, '').replace(/\u00252F/g, '/').replace(/\u00253F((fb_action)|(utm_source)).*/, '');
                if (!unique[item.id]) {
                    newarr.push(item);
                    unique[item.id] = item;
                }
            });
            return newarr;
        };
        if (htmlText == null) {
            htmlText = window.location.href + ' ';
            htmlText += document.documentElement.innerHTML;
        }
        var youtube = /((youtu.be(\\?\/|\u00252F)|watch(([^ \'\'<>]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\'<>\/\\.,#]{11}))|(((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<>]+))|(vimeo.com\\?\/((video\/)|(moogaloop.swf\?.*clip_id=))?(\d+))/g;
        var local = /((youtu.be(\\?\/|\u00252F)|watch(([^ \'\'<>]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\'<>\/\\.,#]{11}))|(((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<>]+))|(vimeo.com\\?\/((video\/)|(moogaloop.swf\?.*clip_id=))?(\d+))/;
        var youtubeLinks = htmlText.match(youtube);
        var result = new Array();
        if (youtubeLinks == null) {
            return '';
        }
        for (var i = 0; i < youtubeLinks.length; i++) {
            youtubeLinks[i].replace(local, function (match) {
                if (match.match(local)[12] != undefined) {
                    result.push({type: 'y', id: match.replace(local, '$12')})
                }
                ;
                if (match.match(local)[18] != undefined) {
                    result.push({type: 's', id: match.replace(local, '$18')})
                }
                ;
                if (match.match(local)[23] != undefined) {
                    result.push({type: 'v', id: match.replace(local, '$23')})
                }
            });
        }
        result = unique(result);
        var hash = '';
        result.forEach(function (item) {
            hash += item.type + '=' + item.id + ',';
        });
        hash = hash.slice(0, -1);
        return hash;
    }

    function updateStatus(postIndex) {
        var title =  document.title.match(/([^-]+)(- .*)?/)[1];
        if(postIndex > -1) {
            var status = "updating " + postIndex + "/" + postCount;
        } else {
            var now = new Date();
            var status = now.toTimeString();
        }
        document.title = title + " - " + status;
        $('#PTIStatus').text(status);
    }

    recalcPostedVideosCount();
    recalcPostCount();
    postPTIfy(0);
    $('.tabmenu').append('<li><a id="PTIStatus">started</a></li>');
})()
