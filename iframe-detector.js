window.addEventListener('load', function() {
  var eagleFrames = document.querySelectorAll('iframe[src*=eagleplatform]');
  // var eagleFrames = document.querySelectorAll('iframe[src]');
  initEagleFeatures(eagleFrames);
});

function initEagleFeatures(targetFrames) {
  for (var i = 0, len = targetFrames.length; i < len; i++) {
    targetFrames[i].setAttribute('visible', false);
  }

  var bodyElement = document.body;
  var floatingCfg = {};
  if (bodyElement.dataset.eagleVideoFloating) {
    floatingCfg.position = bodyElement.dataset.eagleVideoFloatPosition;
    floatingCfg.width = bodyElement.dataset.eagleVideoFloatWidth;
    floatingCfg.offset = bodyElement.dataset.eagleVideoFloatOffset;
  }


  window.addEventListener('message', receiveMessage, false);
  function receiveMessage(message) {
    if (message.origin.indexOf('eagleplatform') > -1) {
      switch(message.data.event) {
        default:
          break;
        case 'play':
          console.log('play');
          break;
        case 'stop':
          console.log('stop');
          break;
      }
    }
  }


  call(targetFrames, floatingCfg);

  window.addEventListener('scroll', function() {
    window.requestAnimationFrame(function() {
      call(targetFrames, floatingCfg);
    });
  });


  console.log('floatingCfg', floatingConfig);

  function call(inputArray, floatingConfig) {
    var frames = inputArray;
    var postMessageData = {};

    for (var i = 0, len = frames.length; i < len; i++) {
      var thisFrame = frames[i];
      var src = thisFrame.getAttribute('src');
      var visible = thisFrame.getAttribute('visible');

      if (src.indexOf('http') === -1) {
        src = window.location.protocol + src;
      }

      if (isInViewport(thisFrame)) {
        if (visible === 'false') {
          thisFrame.setAttribute('visible', true);
          postMessageData.visible = true;
          sendMessage(thisFrame, postMessageData, src)
        }
      } else {
        if (visible === 'true') {
          thisFrame.setAttribute('visible', false);
          postMessageData.visible = false;
          sendMessage(thisFrame, postMessageData, src)
        }
      }
    }
  }

  function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    var halfHeight = element.offsetHeight / 2;
    var elementVisibility = (rect.top + halfHeight) >= 0
      && (rect.bottom - halfHeight) <= (window.innerHeight || document.documentElement.clientHeight);
    return elementVisibility;
  }

  function sendMessage(frame, data, src) {
    frame.contentWindow.postMessage(data, src);
  }
}