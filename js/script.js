/* =============================================================================
                            initialization
============================================================================= */

setTimeout(function(){
  console.log("CSS class '.preload' removed from body element.");
  document.body.classList.remove('preload');
}, 1000);


// Note: The selector passed into Carousel does not need to be an id.
// However the carousel element must have an id in order for the data-targets to work.
const carousel1 = new Carousel("#carousel-1", {
 slideIntervalTime: 5000 //Optional no time means no automation.
});
