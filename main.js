import { overpassCall } from './lib/overpass.js';
import { locationService } from './lib/locationService.js';
import  './components/object-counter.js';
import  './components/warning-indicator.js';

document.querySelector('#app').innerHTML = 
`<div>
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

<warning-indicator allowed="false"></warning-indicator>
<object-counter schools="0" playgrounds="0" youthcenters="0" kindergardens="0"></object-counter>

</div>`
 
locationService.getCurrentPosition()
.then(currentPos => {
  const boundingBox = currentPos.boundingCoordinates(0.3, true, true)
  console.log(currentPos, boundingBox)
  return [
  boundingBox[0].latitude(), boundingBox[0].longitude(),
  boundingBox[1].latitude(), boundingBox[1].longitude(),
  ];
})
.then(bbox => {
  // refactor to use geopoints
    overpassCall(bbox[0], bbox[1], bbox[2], bbox[3])
      .then(res => console.log(res.json()))
}) 
