document.querySelector('#app').innerHTML = `
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
`

 
window.onload(() => {
    getCurrentPosition()
.then(r => {
  const currentPos = new GeoPoint(r.latitude, r.longitude)
  const boundingBox = currentPos.boundingCoordinates(0.3, true, true)
  console.log(currentPos, boundingBox)
  return [
  boundingBox[0].latitude(), boundingBox[0].longitude(),
  boundingBox[1].latitude(), boundingBox[1].longitude(),
  ];
})
.then(bbox => {
    overpassCall(bbox[0], bbox[1], bbox[2], bbox[3])
      .then(res => {
        console.log(res.json())
      })
    
}) 
})
