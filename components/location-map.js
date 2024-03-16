
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import html from "./location-map.html?raw";
const template = document.createElement('template');
template.innerHTML = html

export class LocationMap extends HTMLElement {


    connectedCallback() {
        this.el = this.attachShadow({ mode: 'open' });
        let tmpt = template.content.cloneNode(true);
        this.el.append(tmpt)

        this.attachMap()
    }

    attachMap() {
        let container = this.el.getElementById('map');
        window.container = container
        var map = L.map(container).setView([51.505, -0.09], 16);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            minZoom: 16,
            maxZoom: 16,
        }).addTo(map);

        // disable interactions
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) map.tap.disable();

        // position map based on geo
        map.locate({ setView: true, maxZoom: 16 });
    }
}

customElements.define('location-map', LocationMap);