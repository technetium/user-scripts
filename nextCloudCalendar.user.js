// ==UserScript==
// @name         NextCloud Calendar
// @namespace    http://technetium.be
// @version      1.3.2
// @description  Replaces the links to Google Calendar to NextCloud calendar
// @author       Toni Cornelissen (github@technetium.be)
// @grant        GM_getValue
// @grant        GM_setValue
// @match        *://*.geocaching.com/geocache/*
// @match        *://*.geocaching.com/geocache/*
// @match        *://*.google.com/mail
// @match        *://*/apps/calendar/*
// ==/UserScript==

(function() {
	'use strict';

	//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
	function waitForElem(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					observer.disconnect();
					resolve(document.querySelector(selector));
				}
			});

			// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	function setValue(qs, val) {
		waitForElem(qs).then(elem => {
			elem.value = val;
			// Set more variables and dispatch an event to get vue to do what I want it to do
			elem._value = val;
			elem.dispatchEvent(new Event('input', { bubbles: true }));
		});
	}


	function onClick(e) {
		if ('A' !== e.target.tagName) return;
		if (!e.target.href.match(/https?:\/\/www.google.com\/calendar\/event/)) return;
		const sp = new URLSearchParams(e.target.search);
		if ('TEMPLATE' != sp.get('action')) return;
		e.preventDefault();
		const dates = sp
			.get('dates')
			.split('/')
			.map(d => Date.parse(d.replace(/(\d*)(\d\d)(\d\d)T(\d\d)(\d\d)(.*)/, '$1-$2-$3T$4:$5:$6'))/1000)
		;
		window.location.href =
			GM_getValue('nextCloudServer')
			+ '/apps/calendar/dayGridMonth/now/new/popover/0/'
			+ dates[0] + '/' + dates[1]
			+ '?title=' + encodeURIComponent(sp.get('text'))
			+ '&description=' + encodeURIComponent(sp.get('details'))
			+ '&location=' + encodeURIComponent(sp.get('location'))
	}

	function fillPopover() {
		const sp = new URLSearchParams(window.location.search);
		setValue('.property-title__input input', sp.get('title'));
		setValue('textarea[name="Location"]', sp.get('location'));
		setValue('textarea[name="Description"]', sp.get('description'));
	}

	function main() {
		if (window.location.pathname.startsWith('/apps/calendar/dayGridMonth/now/new/popover/0/')) {
			fillPopover();
		} else if (window.location.pathname.startsWith('/apps/calendar/')) {
			// This is probably the nextCloud calendar service that is being used, store it
			GM_setValue('nextCloudServer', window.location.protocol + '//' +window.location.host);
		} else if (GM_getValue('nextCloudServer', '')) {
			// Using a listener to get links that are added after the loading of the page
			document.addEventListener("click", onClick);
		}
	}
	main();
})();
