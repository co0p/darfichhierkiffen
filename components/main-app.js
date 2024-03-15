import { locationService } from '../lib/locationService.js';
import './object-counter.js';
import './warning-indicator.js';
import { osmService } from '../lib/osmService.js';
import { Location } from '../lib/location.js';

const HUNDRED_M_IN_KM = 0.1;

// main app not using shadowRoot, because it shadowroot cannot be nested?
export class MainApp extends HTMLElement {

    allowed = false;
    schools = 0;
    playgrounds = 0;
    youthcenters = 0;
    kindergardens = 0;

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
                    Is is legal to smoke canabis?
                </p>
            </div>
        </section>
    
        <warning-indicator allowed=${this.allowed}></warning-indicator>
        <object-counter schools=${this.schools} playgrounds=${this.playgrounds} youthcenters=${this.youthcenters} kindergardens=${this.kindergardens}></object-counter>
    
    </div>`
    }

    async fetchLocation() {

        let currentPos = await locationService.getCurrentPosition()
        const boundingBox = currentPos.boundingCoordinates(0.4, true, true)

        let locations = await osmService.getLocations(boundingBox)
        if (locations.length == 0) return;
        
        this.playgrounds = 0;
        this.schools = 0;
        this.youthcenters = 0;
        this.kindergardens = 0;

        // TODO etract to method 
        for (let l of locations) {
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

        // TODO: extract to method
        if (this.playgrounds + this.kindergardens + this.schools + this.youthcenters == 0) {
            this.allowed = true;
        } else {
            this.allowed = false;
        }

        this.render()

    }
}

customElements.define('main-app', MainApp);
