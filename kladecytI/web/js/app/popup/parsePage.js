'use strict';

chrome.runtime.sendMessage({
    operation: "parsedPlaylist",
    href: window.location.href,
    html: document.documentElement.innerHTML
});
