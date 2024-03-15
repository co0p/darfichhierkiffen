import { Location } from "./location";

const query =  (latSW, lngSW, latNE, lngNE) => `[out:json][timeout:25];
( 
  nwr["amenity"="school"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
  nwr["amenity"="kindergarden"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
  nwr["community_centre"="youth_centre"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
  nwr["leisure"="playground"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
);
out geom;`

const overpassURL = 'https://overpass-api.de/api/interpreter';


class OSMService {
    constructor() {}

    async getLocations(bbox) {
        let latSW = bbox[0].latitude(), 
            lngSW = bbox[0].longitude(),
            latNE = bbox[1].latitude(), 
            lngNE = bbox[1].longitude();

    const formBody = new URLSearchParams();
    formBody.append("data", query(latSW, lngSW, latNE, lngNE))

    let res = fetch(overpassURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })
      .then(res => res.json())
      .then(res => {
        let locations = [];
        for (let e of res.elements) {
            let l = new Location(e);
            locations.push(l)
        }

        return locations;
      })

      return res
    }

}


export const osmService = new OSMService();