'use strict';

chrome.runtime.sendMessage({
    operation: "parsePage",
    href: window.location.href,
    html: document.documentElement.innerHTML
});
