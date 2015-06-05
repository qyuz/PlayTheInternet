define(["parse-the-internet"], function (a) {
    function installHint(selector, text) {
        $(document).on({
            mouseenter: function () {
                $installText.addClass('higlight')
                $installText.text(text)
            },
            mouseleave: function () {
                $installText.removeClass('higlight')
                $installText.text(defaultText);
            }
        }, selector);
    }

    var $installText = $('#installText'), defaultText = $installText.text()
    installHint('#installWeb', 'Drag this to your bookmark toolbar, to install Web version.')
    installHint('#installChrome', 'Click to install Chrome extension.')

    function parsePage() {
        var parseTheInternet, links;

        parseTheInternet = ParseTheInternet();
        links = parseTheInternet.parseToString(window.document.documentElement.innerHTML, { origin: window.location.href });
        openWindow(links);
    }

    function openWindow(links) {
        var a = window,
            b = document,
            c = encodeURIComponent,
            d = a.open('http://web.playtheinter.net/play.html?#' + links, 'bkmk_popup', 'left=' + ((a.screenX || a.screenLeft) + 10) + ',top=' + ((a.screenY || a.screenTop) + 10) + ',height=530px,width=1100px,resizable=1,alwaysRaised=1');
        a.setTimeout(function () {
            d.focus();
        }, 300)
    }

    $('#installWeb').attr('href', 'javascript: (function() {' + ParseTheInternet + openWindow + parsePage + ';parsePage();})()')
    $('#installChrome').click(function () {
        $(this).css('opacity', '0.3')
        chrome.webstore.install("https://chrome.google.com/webstore/detail/hnldgcnkcblfbpdjjciadigkjkhkkohk", function () {
            console.log('success')
        }, function () {
            console.log(arguments)
        })
    })
})
