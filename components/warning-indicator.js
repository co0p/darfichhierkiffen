import html from "./warning-indicator.html?raw";
const template = document.createElement('template');
template.innerHTML = html

export class WarningIndicator extends HTMLElement {

    connected = false;
    allowed = false;

    static get observedAttributes() {
        return ['allowed'];
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

        let el = document.getElementsByTagName('warning-indicator')[0];
        let leaf = el.shadowRoot.getElementById('leaf')
        let textEl = el.shadowRoot.getElementById('warning-text')
        
        leaf.classList.remove('is-success');
        leaf.classList.remove('is-danger');
        

        if (this.allowed === 'true') {
            leaf.classList.add('is-success');
            textEl.innerText = 'Is voll ok'
        } else {
            leaf.classList.add('is-danger');
            textEl.innerText = 'Las mal sein'
        }
    }
   
}

customElements.define('warning-indicator', WarningIndicator);