
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import html from "./location-map.html?raw";
const template = document.createElement('template');
template.innerHTML = html

export class LocationMap extends HTMLElement {

    map = null;
    marker = null;
    layerGroup = null;

    latitude = 0;
    longitude = 0;

    _locations = [];

    static get observedAttributes() {
        return ['longitude', 'latitude'];
    }

    constructor() {
        super();
        this.layerGroup = L.layerGroup();
    }

    // for simple values
    connectedCallback() {
        this.el = this.attachShadow({ mode: 'open' });
        let tmpt = template.content.cloneNode(true);
        this.el.append(tmpt)

        this.attachMap()
    }

    // for reacting to complex value setting
    set locations(locs) {

        for (let entry of locs) {
            let geometry = entry.geometry


            if (geometry.length == 1) {
                L.circle(geometry[0].latlong, {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.5,
                    radius: 20,
                }).addTo(this.layerGroup);
            }

            if (geometry.length > 1) {

                let latLongs = [];
                geometry.forEach(e => {
                    latLongs.push(e.latlong)
                })

                L.polygon(latLongs, {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.5,
                }).addTo(this.layerGroup);
            }
        }
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


        // create a new layer for easy removal of added markers
        this.layerGroup.addTo(this.map);
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;

        if (this.map) {
            this.map.setView([this.latitude, this.longitude], 16);

            this.map.removeLayer(this.layerGroup);
            this.layerGroup.addTo(this.map);
        }

        // add the marker circle
        this.marker = L.circle([this.latitude, this.longitude], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: 100
        }).addTo(this.layerGroup);
    }
}

customElements.define('location-map', LocationMap);