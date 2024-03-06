/**
 * darfichhierkiffen is a small website providing you with almost all 
 * the information to decide if you are allowed to smoke canabis
 * in public in Germany. 
 * 
 * It queries openstreetmap for schools, daycare centers, youth centers and playgrounds 
 * in a vicinity of ~200m. 
 * - If one of them is above 100m distance, it means GREEN (allowed)
 * - if one of them is below 100m distance, it means RED (forbidden)
 */

const overpassQuery =  (latSW, lngSW, latNE, lngNE) => `[out:json][timeout:25];
( 
  nwr["amenity"="school"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
  nwr["amenity"="kindergarden"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
  nwr["community_centre"="youth_centre"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
  nwr["leisure"="playground"](${latSW}, ${lngSW}, ${latNE}, ${lngNE});
);
out geom;`

const overpassURL = 'https://overpass-api.de/api/interpreter';

export const overpassCall = (latSW, lngSW, latNE, lngNE)  => {

    const formBody = new URLSearchParams();
    formBody.append("data", overpassQuery(latSW, lngSW, latNE, lngNE))

    return fetch(overpassURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })
}

