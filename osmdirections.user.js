// ==UserScript==
// @name         OSM Directions
// @namespace    http://technetium.be
// @version      1.0
// @description  Replaces the links to GoogleDirections to OpenStreetMap directions
// @author       Toni Cornelissen (github@technetium.be)
// @match        *://*.geocaching.com/geocache/*
// ==/UserScript==

(function() {
    'use strict';

	function main() {
		const elem = document.getElementById('ctl00_ContentBody_lnkPrintDirectionsSimple');
		if (elem) {
			console.warn(elem.href);
            const orig = elem.href.replace(/.*saddr=/, '').replace(/%20.*/, '');
            const dest = elem.href.replace(/.*daddr=/, '').replace(/%20.*/, '');
            console.warn(orig, dest);
            elem.href = 'https://www.openstreetmap.org/directions?route='+orig+'%3B'+dest;
 		}
	}
	main();
})();
