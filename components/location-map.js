
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import html from "./location-map.html?raw";
const template = document.createElement('template');
template.innerHTML = html

export class LocationMap extends HTMLElement {

    map = null;
    marker = null;

    latitude = 0;
    longitude = 0;

    static get observedAttributes() {
        return ['longitude', 'latitude'];
    }

    connectedCallback() {
        this.el = this.attachShadow({ mode: 'open' });
        let tmpt = template.content.cloneNode(true);
        this.el.append(tmpt)

        this.attachMap()
    }

    attachMap() {
        let container = this.el.getElementById('map');
        window.container = container
        this.map = L.map(container).setView([this.latitude, this.longitude], 16);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            minZoom: 16,
            maxZoom: 16,
        }).addTo(this.map);

        // disable interactions
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
        if (this.map.tap) map.tap.disable();

        // position map based on geo
       //  map.locate({ setView: true, maxZoom: 16 });

        // add the marker circle
        this.marker = L.circle([this.latitude, this.longitude], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: 100
        }).addTo(this.map);
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;

        this.map.setView([this.latitude, this.longitude], 16)
        this.circle.setLatLng([this.latitude, this.longitude])

        console.log(this.latitude, this.longitude)
    }
}

customElements.define('location-map', LocationMap);