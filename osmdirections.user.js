// ==UserScript==
// @name         OSM Directions
// @namespace    http://technetium.be
// @version      1.3
// @description  Replaces the links to GoogleDirections to OpenStreetMap directions
// @author       Toni Cornelissen (github@technetium.be)
// @match        *://*.geocaching.com/geocache/*
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        window.addEventListener('load', function() {
            document.querySelectorAll('a[href^="https://maps.google.com/maps\\?f=d"]').forEach((elem) => {
                const orig = elem.href.replace(/.*saddr=/, '').replace(/%20.*/, '');
                const dest = elem.href.replace(/.*daddr=/, '').replace(/%20.*/, '');
                elem.href = 'https://www.openstreetmap.org/directions?route='+orig+'%3B'+dest;
          });
        }, false);
    }
    main();
})();
