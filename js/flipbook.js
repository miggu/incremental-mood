const defaultOptions = {
  start: 0, //start frame
  end: 100, //end frame, must be greater then start
  step: 1, //number of frames to step over while animating
  mobileStep: 3, //number of frames to step over when on a mobile device
  fps: 15, //frames per second, this will be adjusted correctly for step>1
  loop: false, //loop the animation
  //the image path, uses %d to designate where the frame number goes.
  //%#d can be used to specify padding
  images: "",
};

function flipbook(el, options = defaultOptions) {
  var animatingAttr = "flipbook_animating";

  function clamp(value, min) {
    if (value < min) {
      return min;
    }
    return value;
  }

  function padFrame(frame, padding) {
    var frameString = frame + "";
    var delta = padding - frameString.length;
    for (var i = 0; i < delta; ++i) {
      frameString = "0" + frameString;
    }
    return frameString;
  }


  

  return el;
}
