// ==UserScript==
// @name          project-gc Sucks
// @namespace     http://www.technetium.be/pcgSucks
// @description	  Removes project-gc annoyances 
// @include       http://project-gc.com/*
// @include       http://*.project-gc.com/*
// @include       https://project-gc.com/*
// @include       https://*.project-gc.com/*
// ==/UserScript==

// Remove adblock blocker
var adblock = document.getElementById('adb');
if (adblock) {
    adblock.parentNode.removeChild(adblock);
}
adblock = document.getElementById('AdUnit2text');
if (adblock) {
    adblock.parentNode.removeChild(adblock);
}
