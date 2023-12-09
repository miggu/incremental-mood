function flipbook(img, opts) {
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

  const options = { ...defaultOptions, ...opts };

  const animatingAttr = "flipbook_animating";

  //if we are on a mobile webbrowser use the mobile step for better playback
  const is_mobile = navigator.userAgent.toLowerCase().indexOf("mobile") >= 0;

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

  // check if image is animating
  if (img.getAttribute(animatingAttr) === "true") return;

  // collecting images
  const images = img.getAttribute("images") || options.images;

  const imagesMatch = images.match(/([^%]*)%(\d?)d(.*)/);

  let imagesFrontString = imagesMatch[1]; // "img/face/4/ba/""
  let framePadding = 0;
  let imagesEndString = imagesMatch[2]; //  "2"
  if (imagesMatch.length === 4) {
    framePadding = parseInt(imagesMatch[2], 10);
    imagesEndString = imagesMatch[3];
  }

  if (imagesMatch === null) {
    console.error(
      '"' +
        images +
        '" does not conform to images convention, it should be like "frame.%d.jpg" or "frame.%4d.jpg"'
    );
    return;
  }

  const start = parseInt(img.getAttribute("start") || options.start, 10);
  const end = parseInt(img.getAttribute("end") || options.end, 10);
  if (start > end) {
    console.error('"start" cannot be larger then "end"');
    return;
  }
  let step = img.getAttribute("step") || options.step;

  if (is_mobile) {
    step = $image.attr("mobileStep") || options.mobileStep;
  }

  step = clamp(parseInt(step, 10), 1);

  const fps = clamp(parseInt(img.getAttribute("fps") || options.fps, 10), 1);
  const isLoop = img.getAttribute("loop") || options.loop;

  const holdTime = 1000 / (fps / step);

  function imageName(frame) {
    return imagesFrontString + padFrame(frame, framePadding) + imagesEndString;
  }

  let frameNumber = start;

  img.setAttribute("src", imageName(frameNumber));
  img.setAttribute(animatingAttr, "true");

  function flipImage() {
    //increment the frame
    frameNumber += step;

    //check if we've reached the end, if we have
    //and loop is true set the frame back to the start frame
    if (frameNumber > end && isLoop) {
      frameNumber = start;
    }

    if (frameNumber <= end) {
      img.setAttribute("src", imageName(frameNumber));
      setTimeout(flipImage, holdTime);
    } else {
      //always show the last image
      img.setAttribute("src", imageName(end));
      img.setAttribute(animatingAttr, "false");
    }
  }

  //preload images
  let preloadCount = start;
  //check if all the image have been preloaded,
  //if they have start the animation
  function shouldStartAnimation() {
    //console.log('pre: '+imageName(i));
    preloadCount += step;
    if (preloadCount >= end) {
      setTimeout(flipImage, holdTime);
    }
  }
  //asynchronously preload all images,
  //then start the animation
  for (let i = start; i <= end; i += step) {
    const img = document.createElement("img");
    img.src = imageName(i);
    img.onload = shouldStartAnimation;
  }

  return img;
}
