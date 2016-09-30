/* toad.js */
;(function(win,doc){
  
  // first, extreme browser support
  if(!doc.querySelectorAll){
    Document.prototype.getElementsByAttribute 
    = Element.prototype.getElementsByAttribute 
    = function(attr){
      var nodeList = this.getElementsByTagName('*'),
          i = nodeList.length, j = 0, nodeArray = [];
      nodeArray.length = i;
      for(; i > j; j++) if(nodeList[j].getAttribute(attr)) nodeArray[j] = nodeList[j];
      return nodeArray;
    };
  }
  
  // requestAnimationFrame shim
  if(!win.requestAnimationFrame){
    win.requestAnimationFrame = (function(){
      return win.webkitRequestAnimationFrame
          || win.mozRequestAnimationFrame
          || win.oRequestAnimationFrame
          || win.msRequestAnimationFrame
          || function(callback){return win.setTimeout(callback,1000/60)};
    })();
  }
  
  // cancelAnimationFrame shim
  if (!win.cancelAnimationFrame){
    win.cancelAnimationFrame = (function(){
      return win.cancelRequestAnimationFrame
          || win.mozCancelAnimationFrame
          || win.oCancelAnimationFrame
          || win.msCancelAnimationFrame
          || function(id){return win.cancelTimeout(id)};
    })();
  } 
  
  /**
    PRIVATE METHODS i.e. HELPER FUNCTIONS
  **/
  // Detect if the element an image for toad to load
  var isImg = function(el){
    if(!!el && 'img' === el.tagName.toLowerCase() && !el.src) return true;
    return false;
  };
  
  // Detect whether something is in an array of somethings
  // This is used to detect the presence of background-image in an element's attribute styles
  var isInArray = function (arr,i,item){
    while(i--) if(item === arr[i]) return true;
    return false;
  };
  
  // Detect if an element is in the viewport
  // This is really quite obvious really
  var isInViewport = function(el){
    if (!el || 1 !== el.nodeType) return false;
    var r = el.getBoundingClientRect(), wh = (win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight);
    return (r.top >= 0 && r.left >= 0 && r.top <= wh);
  };
  
  var addEventHandler = function(ev,h){
    win.addEventListener ?
      win.addEventListener(ev,h,!1) : 
        win.attachEvent ? 
          win.attachEvent('on'+ev,h) : 
            win['on'+ev] = h;
  };
  
  var removeEventHandler = function(ev,h){
    win.removeEventListener ?
      win.removeEventListener(ev,h,!1) : 
        win.detachEvent ? 
          win.detachEvent('on'+ev,h) : 
            win['on'+ev] = null;
  };
  
  // Use requestAnimationFrame to throttle the execution of a function
  // This is our drop-in alternative to _.debounce or _.throttle to leverage
  // the new requestAnimationFrame API
  var rebounce = function(f){
    var scheduled, context, args, len, i;
    return function(){
      context = this; args = [];
      len = args.length = arguments.length; i = 0;
      for(; i < len; ++i) args[i] = arguments[i];
      win.cancelAnimationFrame(scheduled);
      scheduled = win.requestAnimationFrame(function(){
        f.apply(context, args);
        scheduled = null;
      });
    }
  };
  
  var toad = function(){
    // get everything with data-src attribute, prepare to iterate
    // getElementsByAttribute in case querySelectorAll is not supported
    var elements = doc.querySelectorAll('[data-src]') || doc.getElementsByAttribute('data-src'),
        i = elements.length, j = 0;

    for(; i > j; ++j){
      // iterate over retrieved elements
      var styles = !!elements[j].getAttribute('style') ? elements[j].getAttribute('style').split(':') : false,
          k = !!styles ? styles.length : 0,
          shouldBeLoaded = !!elements[j].getAttribute('data-src') && !!isInViewport(elements[j]),
          isImage = isImg(elements[j]),
          needsBgImage = (!styles || !isInArray(styles,k,'background-image')),
          type = isImage ? 'image' : (needsBgImage ? 'bg' : 'none');
      
      if(!!shouldBeLoaded){
        switch(type){
          case 'image':
            elements[j].src = elements[j].getAttribute('data-src');
            elements[j].removeAttribute('data-src');
            break;
            
          case 'bg':
            elements[j].style.backgroundImage = 'url('+elements[j].getAttribute('data-src')+')';
            elements[j].removeAttribute('data-src');
            break;

          default:
            elements[j].removeAttribute('data-src');
        }
      }
    }
    if(i <= 0) win.toad.stopListening();
  };
  
  var start = function(){
    // Setup event listeners, load anything in the viewport
      addEventHandler('load',toad);
      addEventHandler('scroll',rebounce(toad));
      addEventHandler('resize',rebounce(toad));
  };

  var stop = function(){
    // Stop listening for events to trigger loads
    removeEventHandler('scroll',rebounce(toad));
    removeEventHandler('resize',rebounce(toad));
  };
  
  /**
    PUBLIC METHODS
  **/
  win.toad = {   
    startListening: start,
    stopListening: stop
  };
})(window,window.document);
