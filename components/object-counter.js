import html from "./object-counter.html?raw";
const template = document.createElement('template');
template.innerHTML = html

export class ObjectCounter extends HTMLElement {

    connected = false;
    schools = 0;
    playgrounds = 0;
    youthcenters = 0;
    kindergardens = 0;

    static get observedAttributes() {
        return ['schools', 'playgrounds', 'youthcenters', 'kindergardens'];
    }


    connectedCallback() {
        this.el = this.attachShadow({ mode: 'open' });
        let tmpt = template.content.cloneNode(true); 
        this.el.append(tmpt)
        this.connected = true;

        this.adjustCounts();
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[property] = newValue;

        this.adjustCounts()
    }

    adjustCounts() {
        if (!this.connected) return;

        let el = document.getElementsByTagName('object-counter')[0];
        el.shadowRoot.getElementById('playgrounds_counter').innerText = this.playgrounds;
        el.shadowRoot.getElementById('schools_counter').innerText = this.schools;
        el.shadowRoot.getElementById('youthcenters_counter').innerText = this.youthcenters;
        el.shadowRoot.getElementById('kindergardens_counter').innerText = this.kindergardens;
    }
   
}

customElements.define('object-counter', ObjectCounter);