// ==UserScript==
// @name         Remove onpaste
// @namespace    http://technetium.be
// @version      1.0.0
// @description  Remove onpaste attribute so you can paste data into input fields
// @author       Toni Cornelissen (github@technetium.be)
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    console.log('remove onpaste');
	document.querySelectorAll('[onpaste]').forEach(e=>{
		e.removeAttribute('onpaste');
	})
})();
