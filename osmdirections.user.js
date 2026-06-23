// ==UserScript==
// @name         OSM Directions
// @namespace    http://technetium.be
// @version      1.6
// @description  Replaces the links to GoogleDirections to OpenStreetMap directions
// @author       Toni Cornelissen (codeberg@technetium.be)
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/582982/OSM%20Directions.user.js
// @updateURL https://update.greasyfork.org/scripts/582982/OSM%20Directions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        console.log("OSM Directions");
        window.addEventListener('click', function(e) {
            let target = e.target;
            while (('A' !== target.tagName) && target.parentElement) {
                target = target.parentElement;
            }
            if ('A' != target.tagName) {
            	return;
            }
            let orig = '';
            let dest = '';
			let query = '';
            if (target.href.startsWith('https://maps.google.com/maps?f=d')) {
                orig = target.href.replace(/.*saddr=/, '').replace(/%20.*/, '');
                dest = target.href.replace(/.*daddr=/, '').replace(/%20.*/, '');
            } else if (target.href.startsWith('https://www.google.com/maps/dir/?api=1')) {
                dest = target.href.replace(/.*destination=/, '').replace(/&.*/, '');
            } else if (target.href.startsWith('https://www.google.com/maps?q=')) {
				query = target.href.replace(/.*\?q=/, '');
				console.log('QUERY: ',	query);
            } 
            if (dest) {
                e.preventDefault();
                location.href = 'https://www.openstreetmap.org/directions?route='+orig+'%3B'+dest;
            }
			if (query) {
                e.preventDefault();
                location.href = 'https://www.openstreetmap.org?query='+query;
			}
        });
    }
    main();
})();

