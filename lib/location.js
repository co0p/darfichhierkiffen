import { GeoPoint } from "./geopoint";

export class Location {

    static PLAYGROUND = 'PLAYGROUND'
    static SCHOOL = 'SCHOOL'
    static KINDERGARDEN = 'KINDERGARDEN'
    static YOUTH_CENTRE = 'YOUTH_CENTRE'

    _type = null;
    _geometry = [];

    constructor(osmEntry) {
        this.resolveType(osmEntry.tags)
        this.resolveGeometry(osmEntry)
    }

    distanceTo(other) {
        let distances = [];
        for (let g of this._geometry) {
            distances.push(g.distanceTo(other, true))
        }
        return Math.min(...distances)
    }

    get type() {
        return this._type;
    }

    resolveType(tags) {
        if (tags.leisure && tags.leisure == 'playground') {
            this._type = Location.PLAYGROUND;
        };
        if (tags.amenity && tags.amenity == 'school') {
            this._type = Location.SCHOOL;
        };
        if (tags.amenity && tags.amenity == 'kindergarden') {
            this._type = Location.KINDERGARDEN;
        };
        if (tags.amenity && tags.community_centre == 'youth_centre') {
            this._type = Location.YOUTH_CENTRE;
        };
    }

    resolveGeometry(entry) {
        // way can have a geometry with multiple points
        if (entry.geometry) {
            for (let g of entry.geometry) {
                this._geometry.push(new GeoPoint(g.lat, g.lon))
            }
        } else {
            // the element itself is a point
            this._geometry.push(new GeoPoint(entry.lat, entry.lon))
        }
    }
}