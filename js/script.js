/* =============================================================================
                            initialization
============================================================================= */

setTimeout(function(){
  console.log("CSS class '.preload' removed from body element.");
  document.body.classList.remove('preload');
}, 1000);


// Note: The selector passed into Carousel does not need to be an id.
// However the carousel element MUST have an id in order for the data-targets to work.
const carousel1 = new Carousel("#carousel-1", {
 slideIntervalTime: 3000,  // Defaults to 3000. Must be over 600, or will be converted to 1000
 shouldPlay: true,         // Defaults to false.
 shouldStopOnHover: false  // Defaults to true, but only is implemented if there are no
});                        // .play-pause-button elements, and shouldPlay is true.
