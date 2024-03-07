import { overpassCall } from '../lib/overpass.js';
import { locationService } from '../lib/locationService.js';
import './object-counter.js';
import './warning-indicator.js';

// main app not using shadowRoot, because it shadowroot cannot be nested?
export class MainApp extends HTMLElement {
    static observedAttributes = ["playgrounds"];

    allowed = false;
    schools = 0;
    playgrounds = 0;
    youthcenters = 0;
    kindergardens = 0;

    constructor() {
        self = super();
        this.allowed = false;
        this.schools = 1;
        this.playgrounds = 1;
        this.youthcenters = 1;
        this.kindergardens = 1;
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

    fetchLocation() {

        locationService.getCurrentPosition()
            .then(currentPos => {
                const boundingBox = currentPos.boundingCoordinates(0.2, true, true)
                console.log(currentPos, boundingBox)
                return [
                    boundingBox[0].latitude(), boundingBox[0].longitude(),
                    boundingBox[1].latitude(), boundingBox[1].longitude(),
                ];
            })
            .then(bbox => {
                // refactor to use geopoints
                overpassCall(bbox[0], bbox[1], bbox[2], bbox[3])
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        console.log(res)

                        if (res.elements.length == 0) return;
                        this.playgrounds = 0;
                        this.schools = 0;
                        this.youthcenters = 0;
                        this.kindergardens = 0;

                        res.elements.forEach(element => {
                            if (element.tags.leisure && element.tags.leisure == 'playground') {
                                this.playgrounds++;
                            };
                            if (element.tags.amenity && element.tags.amenity == 'school') {
                                this.schools++;
                            };
                            if (element.tags.amenity && element.tags.amenity == 'kindergarden') {
                                this.kindergardens++;
                            };
                            if (element.tags.amenity && element.tags.community_centre == 'youth_centre') {
                                this.youthcenters++;
                            };
                        });

                        if (this.playgrounds + this.kindergardens + this.schools + this.youthcenters == 0) {
                            this.allowed = true;
                        }  else {
                            this.allowed = false;
                        }
                    })
                    .finally(_ => this.render()
                    )

            })

    }
}

customElements.define('main-app', MainApp);
