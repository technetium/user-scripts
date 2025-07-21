// ==UserScript==
// @name         uMap Routing
// @namespace    http://umaprouting.technetium.be
// @version      v0.0.1
// @description  Add routing to uMap
// @author       Toni Cornelissen
// @match        https://umap.openstreetmap.fr/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
	function waitForElm(selector) {
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



    function addRoutingModal() {
        console.log('addRoutingModal');
        const elem = document.createElement("div");
        elem.id = 'routingModal';
        elem.className = 'with-transition panel window right dark on';
        elem.dataset.highlight = 'route';
        elem.innerHTML = `
            <ul class="buttons">
                <li class=""><button class="icon icon-16 icon-close" title="Close" id="routingModalClose"></button></li>
                <li class=""><button class="icon icon-16 icon-resize" title="Toggle size"></button></li>
            </ul>
            <div class="body"><div><form data-ref="form">
                <h3><i class="icon icon-24 icon-template"></i>Add points to route</h3>
                <p>Explanation.</p>
                <div class="formbox">
                    <div class="flat-tabs" data-ref="tabs">
						<!--
                        <button type="button" class="flat" data-value="mine" data-ref="mine" hidden="">My templates</button>
                        <button type="button" class="flat on" data-value="staff">From staff</button>
                        <button type="button" class="flat" data-value="community">From community</button>
						-->
						API Key: <input name="GraphHopperApiKey" id="GraphHopperApiKey" />
					</div>
                    <div data-ref="body" class="body">
						<ul id="routePoints">
						<!--
                        <ul><li><label>
                            <input type="radio" value="1239140" name="template">Randonnée<a href="/en/map/randonnee_1239140" target="_blank"><nobr>Explore<i class="icon icon-16 icon-external-link"></i></nobr></a>
                        </label></li>
						-->
						</ul>
                    </div>
                    <div class="button-bar half">
                        <button type="button" class="primary" data-ref="confirm" id="addRouteButton">Add Route</button>
                        <button type="button" data-ref="confirmData" disabled="">Load template with data</button>
                    </div>
                </div>
            </form></div></div>
        `;

        const hr = document.querySelector('.umap-main-edit-toolbox');
        console.log(hr)
        hr.parentNode.insertBefore(elem, hr);
        document.getElementById('routingModalClose').addEventListener('click', removeRoutingModal);
		document.getElementById('addRouteButton').addEventListener('click', addRoute);
    }

    function removeRoutingModal() {
        console.log('removeRoutingModal');
        document.getElementById('routingModal').remove();
    }

    function showRoutingModal() {
        console.log('showRoutingModal');
        if (!document.getElementById('routingModal')) {
          addRoutingModal();
        }
    }

    function addRoutingIcon() {
        console.log('addRoutingIcon');
        const elem = document.createElement("li");
        elem.dataset.ref = "route";
        elem.innerHTML = '<button type="button" data-getstarted="" title="Draw a route (Ctrl+R)"><i class="icon icon-24 icon-empty"></i></button>';
        //elem.addEventListener('click', showRoutingModal);
        elem.addEventListener('click', importData);
        const hr = document.querySelector('.umap-edit-bar hr');
        hr.parentNode.insertBefore(elem, hr);
    }

	function idFromElement(elem) {
        while (elem && elem.classList) {
            if (elem.classList.contains('leaflet-marker-icon')) {
				return elem.dataset.feature;
			}
            elem = elem.parentNode;
        }
	}

	function coordinatesFromId(id) {
	    for (let key in U.MAP.datalayers) {
            if (U.MAP.datalayers[key].features.has(id)) {
                return U.MAP.datalayers[key].features.get(id).geometry.coordinates;
            }
        }
	}

	function nameFromId(id) {
	    for (let key in U.MAP.datalayers) {
            if (U.MAP.datalayers[key].features.has(id)) {
                return U.MAP.datalayers[key].features.get(id).properties.name;
            }
        }
	}

	function addToRoute(id, name) {
		console.log(`addToRoute(${id}, ${name})`);
    	const elem = document.createElement("ul");
		elem.dataset.featureId = id;
		elem.textContent = name || id;
		const hr = document.getElementById('routePoints');
		hr.appendChild(elem);
	}

	function addRoute() {
		console.log('AddRoute()');
		const url = 'https://graphhopper.com/api/1/route?key=' + document.getElementById('GraphHopperApiKey').value;
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		
		const data = {
			elevation: false,
			points: Array
				.from(document.getElementById('routePoints').children)
				.map(elem => coordinatesFromId(elem.dataset.featureId)),
			points_encoded: false,	
			profile: 'car',
		}
		console.log(data);
		console.log(JSON.stringify(data));

		window.fetch(
			url,
			{
				body: JSON.stringify(data),
				headers: headers,
				method: 'POST',
                mode: 'cors',
			}
		)
			.then(res => res.json())
			.then(json => console.log(json))
			.catch(error => console.error(error))
		;
	}

	function importData() {
		document.querySelector('li[data-ref="import"] button').click();
		waitForElm('.umap-import textarea').then((elm) => {
			document.querySelector('.umap-import textarea').value="Hoera";
			document.querySelector('.umap-import select[name="format"]').value = 'geojson';
			document.querySelector('.umap-import select[name="layer-id"]').value = document.querySelector('.umap-import select[name="layer-id"] option').value;

		});
	}
	


    function onClick(e) {
        if (!document.getElementById('routingModal')) { return; }
        //console.log(e);
        const id = idFromElement(e.target);
		const name = nameFromId(id);
		const coords = coordinatesFromId(id);
		if (id) {
			addToRoute(id, name);
		}
    }

    console.log('uMap Routing');
    addRoutingIcon();
    document.addEventListener('click', onClick);

})();
