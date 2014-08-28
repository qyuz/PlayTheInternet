define(["parse"], function (a) {
    function installHint(selector, text) {
        $(document).on({
            mouseenter: function () {
                $installText.css('background-color', 'yellow');
                $installText.css('color', '#555');
                $installText.text(text)
            },
            mouseleave: function () {
                $installText.css('background', 'none');
                $installText.css('color', defaultColor);
                $installText.text(defaultText);
            }
        }, selector);
    }

    var $installText = $('#installText'), defaultText = $installText.text(), defaultColor = $installText.css('color')
    installHint('#installWeb', 'Drag this to your bookmark toolbar, to install Web version.')
    installHint('#installChrome', 'Click to install Chrome extension.')

    function parsePage() {
        openWindow(playTheInternetParse());
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

    $('#installWeb').attr('href', 'javascript: (function() {' + playTheInternetParse + openWindow + parsePage + ';parsePage()})()')
    $('#installChrome').click(function () {
        $(this).css('opacity', '0.3')
        chrome.webstore.install("https://chrome.google.com/webstore/detail/hnldgcnkcblfbpdjjciadigkjkhkkohk", function () {
            console.log('success')
        }, function () {
            console.log(arguments)
        })
    })
})
