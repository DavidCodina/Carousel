function Carousel(selector, config){
  this._config                     = config || {};
  this._carousel                   = document.querySelector(selector);
  this._items                      = this._carousel.querySelectorAll('.carousel-item');
  this._prevControls               = document.querySelectorAll('.carousel-control-prev[data-target="#' + this._carousel.id + '"]');
  this._nextControls               = document.querySelectorAll('.carousel-control-next[data-target="#' + this._carousel.id + '"]');
  this._indicators                 = document.querySelectorAll('.carousel-indicators [data-target="#'  + this._carousel.id + '"]');
  this._playPauseButtons           = document.querySelectorAll('.play-pause-button[data-target="#'     + this._carousel.id + '"]');
  this._activeItem                 = this._carousel.querySelector('.carousel-item.active');
  this._setActiveIndex             = this._setActiveIndex.bind(this); // early binding
  this._activeIndex                = this._setActiveIndex();
  this._isTransitioning            = false;
  this._slideInterval              = null;
  this._shouldPlay                 = (this._config.hasOwnProperty('shouldPlay')) ? config.shouldPlay : false;
  this._isPlaying                  = false;
  this._slideIntervalTime          = (this._config.hasOwnProperty('slideIntervalTime')) ? this._config.slideIntervalTime : 3000;
  this._shouldStopOnHover          = (this._config.hasOwnProperty('shouldStopOnHover')) ? this._config.shouldStopOnHover : true;
  this._init                       = this._init.bind(this);
  this.prev                        = this.prev.bind(this);
  this.next                        = this.next.bind(this);
  this._updateIndicators           = this._updateIndicators.bind(this);
  this._handleIndicatorClick       = this._handleIndicatorClick.bind(this);
  this.play                        = this.play.bind(this);
  this.pause                       = this.pause.bind(this);
  this._handlePlayPauseButtonClick = this._handlePlayPauseButtonClick.bind(this);
  this._updatePlayPauseButtons     = this._updatePlayPauseButtons.bind(this);
  this._handleMouseEnter           = this._handleMouseEnter.bind(this);
  this._handleMouseLeave           = this._handleMouseLeave.bind(this);
  this.destroy                     = this.destroy.bind(this);

  if (this._slideIntervaltime <= 600){ this._slideIntervalTime = 1000; }
  this._init();
  return this;
}




Carousel.prototype._init = function(){
  for (let i = 0; i < this._prevControls.length; i++){
    const prevControl = this._prevControls[i];
    prevControl.addEventListener('click', this.prev);
  }
  for (let i = 0; i < this._nextControls.length; i++){
    const nextControl = this._nextControls[i];
    nextControl.addEventListener('click', this.next);
  }
  for (let i = 0; i < this._indicators.length; i++){
    const indicator = this._indicators[i];
    indicator.addEventListener('click', this._handleIndicatorClick);
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //  Do not implement hover feature if there is a play/pause button.
  //  Having both systems in place could be confusing to the user. That said, one could still have
  //  buttons that run play() and pause, just don't give them the .play-pause-button class.
  //
  //////////////////////////////////////////////////////////////////////////////

  if (this._playPauseButtons.length === 0 && this._shouldPlay && this._shouldStopOnHover){
    this._carousel.addEventListener('mouseenter', this._handleMouseEnter);
    this._carousel.addEventListener('mouseleave', this._handleMouseLeave);
  }

  // Wait two seconds just in case transitions are initially disabled by some other code.
  // The timeout value may need to be modified for specific use cases in which transitions are disabled for longer.
  setTimeout(function(){
    // Prevent user from clicking until 2 seconds have elapsed.
    for (let i = 0; i < this._playPauseButtons.length; i++){
      const playPauseButton = this._playPauseButtons[i];
      playPauseButton.addEventListener('click', this._handlePlayPauseButtonClick);
    }

    if (this._shouldPlay){ this.play(); }
  }.bind(this), 2000);
};


////////////////////////////////////////////////////////////////////////////////
//
//  Find the index of the current .carousel-item.active, then return it to this._activeIndex.
//  If no .carousel-item.active is found, then set the '.active' class on the first item,
//  and return 0 to this._activeIndex. If there are indicators and for some reason
//  there is no '.active' on an indicator, it will update automatically after the
//  initial slide.
//
//  Note: this method is only used in the constructor. Updating _activeIndex is
//  subsequently done internally without reaching into the DOM.
//
////////////////////////////////////////////////////////////////////////////////


Carousel.prototype._setActiveIndex = function(){
  for (let i = 0; i < this._items.length; i++){
    const item = this._items[i];
    if (item.classList.contains('active')){ return i; }
  }
  const firstItem = this._carousel.querySelector('.carousel-inner').firstElementChild;
  if (firstItem){
    firstItem.classList.add('active');
    this._activeItem = firstItem;
  }
  return 0;
};




Carousel.prototype.prev = function(e){
  if (e){ e.preventDefault();          }
  if (this._isTransitioning){ return;  }
  else { this._isTransitioning = true; }

  const currentItem = this._carousel.querySelector('.carousel-item.active');
  const prevItem    = (currentItem.previousElementSibling) ? currentItem.previousElementSibling : this._carousel.querySelector('.carousel-inner').lastElementChild;

  prevItem.classList.add('carousel-item-prev');
  void(currentItem.offsetHeight); //force reflow.
  currentItem.classList.add('carousel-item-end');
  prevItem.classList.add('carousel-item-end');

  this._activeItem  = prevItem;
  this._activeIndex = ((this._activeIndex - 1) < 0) ? this._items.length-1 : this._activeIndex - 1;
  this._updateIndicators();

  setTimeout(function(){
    prevItem.classList.remove('carousel-item-prev');
    currentItem.classList.remove('carousel-item-end');
    prevItem.classList.remove('carousel-item-end');
    currentItem.classList.remove('active');
    prevItem.classList.add('active');
    this._isTransitioning = false;
  }.bind(this), 600);
  return this;
};




Carousel.prototype.next = function(e){
  if (e){ e.preventDefault();          }
  if (this._isTransitioning){ return;  }
  else { this._isTransitioning = true; }

  const currentItem = this._carousel.querySelector('.carousel-item.active');
  const nextItem    = (currentItem.nextElementSibling) ? currentItem.nextElementSibling : this._carousel.querySelector('.carousel-inner').firstElementChild;

  nextItem.classList.add('carousel-item-next');
  void(currentItem.offsetHeight); //force reflow.
  currentItem.classList.add('carousel-item-start');
  nextItem.classList.add('carousel-item-start');

  this._activeItem  = nextItem;
  this._activeIndex = (this._activeIndex + 1) % this._items.length;
  this._updateIndicators();

  setTimeout(function(){
    nextItem.classList.remove('carousel-item-next');
    currentItem.classList.remove('carousel-item-start');
    nextItem.classList.remove('carousel-item-start');
    currentItem.classList.remove('active');
    nextItem.classList.add('active');
    this._isTransitioning = false;
  }.bind(this), 600);
  return this;
};




Carousel.prototype._updateIndicators = function(){
  if (this._indicators === null || typeof this._indicators === 'undefined' || this._indicators.length === 0){ return; }

  for (let i = 0; i < this._indicators.length; i++){
    const indicator    = this._indicators[i];
    const slideToIndex = parseInt(indicator.getAttribute('data-slide-to'));
    if (indicator.classList.contains('active') && slideToIndex !== this._activeIndex){
      indicator.classList.remove('active');
    } else if (slideToIndex === this._activeIndex){
      indicator.classList.add('active');
    }
  }
};




Carousel.prototype._handleIndicatorClick = function(e){
  if (e){ e.preventDefault();          }
  if (this._isTransitioning){ return;  }
  else { this._isTransitioning = true; }

  let slideToIndex = e.target.getAttribute('data-slide-to');
  if (!slideToIndex){ return; }

  slideToIndex             = parseInt(slideToIndex);
  const currentItem        = this._carousel.querySelector('.carousel-item.active');
  const nextItem           = this._carousel.querySelectorAll('.carousel-item')[slideToIndex];
  const prevItem           = nextItem; //Just for semantics.
  const shouldDoNothing    = (slideToIndex === this._activeIndex) ? true : false;
  const shouldSlideForward = (slideToIndex  >  this._activeIndex) ? true : false;
  const shouldSlideBack    = (slideToIndex  <  this._activeIndex) ? true : false;

  if (shouldDoNothing){
    this._isTransitioning = false;
  }

  else if (shouldSlideForward){
    nextItem.classList.add('carousel-item-next');
    void(currentItem.offsetHeight); //force reflow.
    currentItem.classList.add('carousel-item-start');
    nextItem.classList.add('carousel-item-start');

    this._activeItem  = nextItem;
    this._activeIndex = slideToIndex;
    this._updateIndicators();

    setTimeout(function(){
      nextItem.classList.remove('carousel-item-next');
      currentItem.classList.remove('carousel-item-start');
      nextItem.classList.remove('carousel-item-start');
      currentItem.classList.remove('active');
      nextItem.classList.add('active');
      this._isTransitioning = false;
    }.bind(this), 600);
  }

  else if (shouldSlideBack){
    prevItem.classList.add('carousel-item-prev');
    void(currentItem.offsetHeight); //force reflow.
    currentItem.classList.add('carousel-item-end');
    prevItem.classList.add('carousel-item-end');

    this._activeItem  = prevItem;
    this._activeIndex = slideToIndex;
    this._updateIndicators();

    setTimeout(function(){
      prevItem.classList.remove('carousel-item-prev');
      currentItem.classList.remove('carousel-item-end');
      prevItem.classList.remove('carousel-item-end');
      currentItem.classList.remove('active');
      prevItem.classList.add('active');
      this._isTransitioning = false;
    }.bind(this), 600);
  }
};




Carousel.prototype._updatePlayPauseButtons = function(){
  if (this._playPauseButtons.length === 0){ return; }

  for (let i = 0; i < this._playPauseButtons.length; i++){
    const playPauseButton = this._playPauseButtons[i];
    const playElement     = playPauseButton.querySelector('.play-element');
    const pauseElement    = playPauseButton.querySelector('.pause-element');
    if (!playElement || !pauseElement){ continue; }

    if (this._isPlaying){
      playElement.style.display  = 'none';
      pauseElement.style.display = 'block';
    } else {
      pauseElement.style.display = 'none';
      playElement.style.display  = 'block';
    }
  }
};




Carousel.prototype.play = function(){
  clearInterval(this._slideInterval);
  this._slideInterval = setInterval(this.next, this._slideIntervalTime);
  this._isPlaying = true;
  this._updatePlayPauseButtons();
  return this;
};




Carousel.prototype.pause = function(){
  clearInterval(this._slideInterval);
  this._isPlaying = false;
  this._updatePlayPauseButtons();
  return this;
};




Carousel.prototype._handlePlayPauseButtonClick = function(e){
  if (e){ e.preventDefault();               }
  if      (this._isPlaying){  this.pause(); }
  else if (!this._isPlaying){ this.play();  }
};




Carousel.prototype._handleMouseEnter = function(){
  this.pause();
};




Carousel.prototype._handleMouseLeave = function(){
  this.play();
};




Carousel.prototype.destroy = function(){
  for (let i = 0; i < this._prevControls.length; i++){
    const prevControl = this._prevControls[i];
    prevControl.removeEventListener('click', this.prev);
  }
  for (let i = 0; i < this._nextControls.length; i++){
    const nextControl = this._nextControls[i];
    nextControl.removeEventListener('click', this.next);
  }
  for (let i = 0; i < this._indicators.length; i++){
    const indicator = this._indicators[i];
    indicator.removeEventListener('click', this._handleIndicatorClick);
  }
  for (let i = 0; i < this._playPauseButtons.length; i++){
    const playPauseButton = this._playPauseButtons[i];
    playPauseButton.removeEventListener('click', this._handlePlayPauseButtonClick);
  }
  this.pause(); // i.e,. clearInterval(this._slideInterval);
  this._carousel.removeEventListener('mouseenter', this._handleMouseEnter);
  this._carousel.removeEventListener('mouseleave', this._handleMouseLeave);
  return this;
};
