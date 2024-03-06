import {Geopoint} from './geopoint.js';

export const EVENT_POSITION_UPDATED = 'EVENT_POSITION_UPDATED';
export const EVENT_OBJECTS_UPDATED = 'EVENT_OBJECTS_UPDATED';

class Store {


    _trackingEnabled = false;
    _currentPosition = null;
    _schools = [];
    _playgrounds = [];
    _youthcenters = [];
    _kindergardens = [];

    get currentPosition() {
        return this._currentPosition;
    }

    set currentPosition(position) {
        this._currentPosition = position;
        this.publish(EVENT_POSITION_UPDATED, this._currentPosition);
    }

    get schools() {
        return [...this._schools];
    }

    get playgrounds() {
        return [...this._playgrounds];
    }

    get youthcenters() {
        return [...this._youthcenters];
    }

    get kindergardens() {
        return [...this._kindergardens];
    }

    set schools(schools) {
        this._schools = schools;
        this.publish(EVENT_OBJECTS_UPDATED, this.buildSummary());
    }

    set schools(playgrounds) {
        this._playgrounds = playgrounds;
        this.publish(EVENT_OBJECTS_UPDATED, this.buildSummary());
    }

    set schools(youthcenters) {
        this._youthcenters = youthcenters;
        this.publish(EVENT_OBJECTS_UPDATED, this.buildSummary());
    }

    set schools(kindergardens) {
        this._kindergardens = kindergardens;
        this.publish(EVENT_OBJECTS_UPDATED, this.buildSummary());
    }

    buildSummary() {
        return {
            'schools': this._schools,
            'playgrounds': this._playgrounds,
            'youthcenters': this._youthcenters,
            'kindergardens': this._kindergardens
        }
    }


    /** https://medium.com/@adityakashyap_36551/the-pub-sub-pattern-event-management-in-javascript-17196444ca2f */
    // on logic can be leveraged to fulfill subscribe
    subscribe(event, handler){
        if(!this.events[event]){
            this.events[event] = []
        }
        this.events[event].push(handler)
    }
    
    //off logic can be leveraged to fulfill unsubscribe
    unsubscribe(event, handler){
        if(this.events[event]){
            const index = this.events[event].findIndex(item => item === handler)
            this.events[event].splice(index, 1);
        }
    }
    
    //emit logic can be leveraged to fulfill unsubscribe
    publish(event, data){
        if(this.events[event]){
            this.events[event].forEach(handler => handler(data));
        }
    }
}

export const store = new Store();