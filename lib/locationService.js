import { GeoPoint } from "./geopoint";

const options = {
    enableHighAccuracy: true,
    timeout: 5000, // in ms
    maximumAge: 0, // 0 = no caching
}


class LocationService {

    constructor() { }

    async getCurrentPosition() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition((location) => {
                resolve(new GeoPoint(location.coords.latitude, location.coords.longitude))
            }, () => {
                console.error('failed to get location')
                reject();
            }, options);
        });
    }
}


export const locationService = new LocationService();