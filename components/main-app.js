import { locationService } from '../lib/locationService.js';
import './object-counter.js';
import './warning-indicator.js';
import './location-map.js';
import { osmService } from '../lib/osmService.js';
import { Location } from '../lib/location.js';

const HUNDRED_M_IN_KM = 0.1;

// main app not using shadowRoot, because it's shadowroot cannot be nested?
export class MainApp extends HTMLElement {

    allowed = false;
    schools = 0;
    playgrounds = 0;
    youthcenters = 0;
    kindergardens = 0;

    locations = [];

    longitude = null;
    latitude = null;

    constructor() {
        self = super();
        this.allowed = false;
        this.schools = 0;
        this.playgrounds = 0;
        this.youthcenters = 0;
        this.kindergardens = 0;
    }


    connectedCallback() {
        this.render();
        this.fetchLocation();
    }

    render() {
        self.innerHTML = `<div>
            <section class="section">
                <div class="container">
                    <h1 class="title">
                        Darf Ich Hier Kiffen?
                    </h1>
                    <p class="subtitle">
                        Is it legal to smoke canabis?
                    </p>
                </div>
            </section>
        
            <warning-indicator allowed=${this.allowed}></warning-indicator>
            <object-counter schools=${this.schools} playgrounds=${this.playgrounds} youthcenters=${this.youthcenters} kindergardens=${this.kindergardens}></object-counter>
            <location-map latitude=${this.latitude} longitude=${this.longitude}></location-map>
        
        </div>`

        let map = this.querySelector('location-map');
        map.locations = this.locations;
    }

    async fetchLocation() {

        let currentPos = await locationService.getCurrentPosition()
        this.latitude = currentPos.latitude();
        this.longitude = currentPos.longitude();

        const boundingBox = currentPos.boundingCoordinates(HUNDRED_M_IN_KM, true, true)

        this.locations = [];
        try {
            this.locations = await osmService.getLocations(boundingBox)
        } catch (err) {
            console.log('failed to fetch locations', err);
        }
        
        if (this.locations.length == 0) {
            this.allowed = true;
            this.render();
            return;
        }

        this.playgrounds = 0;
        this.schools = 0;
        this.youthcenters = 0;
        this.kindergardens = 0;

        // TODO extract to method 
        for (let l of this.locations) {
            if (l.distanceTo(currentPos) > HUNDRED_M_IN_KM) {
                continue;
            }

            if (l.type === Location.PLAYGROUND) {
                this.playgrounds++;
            }
            if (l.type === Location.SCHOOL) {
                this.schools++;
            }
            if (l.type === Location.KINDERGARDEN) {
                this.kindergardens++;
            }
            if (l.type === Location.YOUTH_CENTRE) {
                this.youthcenters++;
            }
        }

        this.allowed = (this.playgrounds + this.kindergardens + this.schools + this.youthcenters == 0)
        this.render()
    }
}

customElements.define('main-app', MainApp);
