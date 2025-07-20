// ==UserScript==
// @name         umap routing
// @namespace    http://tampermonkey.net/
// @version      2025-07-20
// @description  try to take over the world!
// @author       You
// @match        https://umap.openstreetmap.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openstreetmap.fr
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addModal() {
        console.log('addModal');
        const elem = document.createElement("div");
        elem.id = 'routeModal';
        elem.className = 'with-transition panel window right dark on';
        elem.dataset.highlight = 'route';
        /*
        elem.style.width = '100px';
        elem.style.height = '100px';
        elem.style.zIndex = 99999;
        elem.position = 'absolute';
        */
        elem.innerHTML = `
            <ul class="buttons">
                <li class=""><button class="icon icon-16 icon-close" title="Close"></button></li>
                <li class=""><button class="icon icon-16 icon-resize" title="Toggle size"></button></li>
            </ul>
            <div class="body"><div><form data-ref="form">
                <h3><i class="icon icon-24 icon-template"></i>Add points to route</h3>
                <p>Explanation.</p>
                <!--
                <div class="formbox">
                    <div class="flat-tabs" data-ref="tabs">
                        <button type="button" class="flat" data-value="mine" data-ref="mine" hidden="">My templates</button>
                        <button type="button" class="flat on" data-value="staff">From staff</button>
                        <button type="button" class="flat" data-value="community">From community</button>
                    </div>
                    <div data-ref="body" class="body">
                        <ul><li><label>
                            <input type="radio" value="1239140" name="template">Randonnée<a href="/en/map/randonnee_1239140" target="_blank"><nobr>Explore<i class="icon icon-16 icon-external-link"></i></nobr></a>
                        </label></li></ul>
                    </div>
                    <div class="button-bar half">
                        <button type="button" class="primary" data-ref="confirm" disabled="">Load template</button>
                        <button type="button" data-ref="confirmData" disabled="">Load template with data</button>
                    </div>
                </div>
                -->
            </form></div></div>
        `;

        elem.addEventListener('click', removeModal);
        const hr = document.querySelector('.umap-main-edit-toolbox');
        console.log(hr)
        hr.parentNode.insertBefore(elem, hr);
    }

    function removeModal() {
        console.log('removeModal');
        document.getElementById('routeModal').remove();
    }

    function showRouteModal() {
        console.log('showRouteModal');
        if (!document.getElementById('routeModal')) {
          addModal();
        }
    }

    function addRouting() {
        console.log('addRouting');
        const elem = document.createElement("li");
        elem.dataset.ref = "route";
        elem.innerHTML = '<button type="button" data-getstarted="" title="Draw a route (Ctrl+R)"><i class="icon icon-24 icon-empty"></i></button>';
        elem.addEventListener('click', showRouteModal);
        const hr = document.querySelector('.umap-edit-bar hr');
        hr.parentNode.insertBefore(elem, hr);
    }

    function onClick(e) {
        //if (!document.getElementById('routeModal')) { return; }
        console.log(e);
        let target = e.target;
        while (target.classList) {
            if (target.classList.contains('leaflet-marker-icon')) { break; }
            target = target.parentNode;
        }
        if (!target.classList) { return; }
        //console.log(U);
        console.log(target);
        const id = target.dataset.feature;
        //console.log('id', )
        for (let lk in U.MAP.datalayers) {
            //console.log('lk', U.MAP.datalayers[lk].features, lk)
            if (U.MAP.datalayers[lk].features.has(id)) {
                console.log(U.MAP.datalayers[lk].features.get(id));
                var name = U.MAP.datalayers[lk].features.get(id).properties.name;
                var coords = U.MAP.datalayers[lk].features.get(id).geometry.coordinates;
                break;
            }
        }
        console.log(id, name, coords);
    }

    console.log('Hello World');
    addRouting();
    document.addEventListener('click', onClick);

})();
