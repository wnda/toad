/* toad.js */
// pass in window, window.document
;(function(win,doc){
  
  // first, for some extreme browser support
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
  
  // now add a crap requestAnimationFrame shim
  if(!win.requestAnimationFrame){
    win.requestAnimationFrame = (function(){
      return win.webkitRequestAnimationFrame
          || win.mozRequestAnimationFrame
          || win.oRequestAnimationFrame
          || win.msRequestAnimationFrame
          || function(callback){return win.setTimeout(callback,1000/60)};
    })();
  }
  
  // same again please
  if(!win.cancelAnimationFrame){
    win.cancelAnimationFrame = (function(){
      return win.webkitCancelRequestAnimationFrame
          || win.mozCancelAnimationFrame
          || win.oCancelAnimationFrame
          || win.msCancelAnimationFrame
          || function(id){return win.cancelTimeout(id)};
    })();
  }
  
  // normalise event handling
  function addEventHandler(ev,h){
    win.addEventListener ?
      win.addEventListener(ev,h,!1) : 
        win.attachEvent ? 
          win.attachEvent('on'+ev,h) : 
            win['on'+ev] = h;
  }
  
  // same again for removing handlers
  function removeEventHandler(ev,h){
    win.removeEventListener ?
      win.removeEventListener(ev,h,!1) : 
        win.detachEvent ? 
          win.detachEvent('on'+ev,h) : 
            win['on'+ev] = null;
  }
  
  // Flag whether something is in an array of somethings
  // This is used to detect the presence of background-image in an element's attribute styles
  function isInArray(arr,i,item){
    while(i--) if(item === arr[i]) return true;
    return false;
  }
  
  // Detect if an element is in the viewport
  // This is really quite obvious really
  function isInViewport(el){
    var r = el.getBoundingClientRect(), wh = (win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight);
    return r.top >= 0 && r.left >= 0 && r.top <= wh;
  }
  
  // Use requestAnimationFrame to throttle the execution of a function
  // This is our drop-in alternative to _.debounce or _.throttle to leverage
  // the new requestAnimationFrame API, which we normalised earlier
  // note the means of passing arguments without referencing arguments, only
  // arguments.length and arguments[n], thereby allowing V8 to optimise
  function rebounce(f){
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
  }
  
  function prep(){
    // get everything with data-src attribute, prepare to iterate
    // getElementsByAttribute in case querySelectorAll is not supported
    var elements = doc.querySelectorAll('[data-src]') || doc.getElementsByAttribute('data-src'),
        i = elements.length, j = 0;

    for(; i > j; ++j){
      // iterate over retrieved elements
      var this_el = elements[j],
          styles = !!this_el.getAttribute('style') ? this_el.getAttribute('style').split(':') : false,
          k = !!styles ? styles.length : 0,
          shouldBeLoaded = !!this_el.getAttribute('data-src') && isInViewport(this_el),
          isImage = 'img' === this_el.tagName.toLowerCase() && !this_el.src,
          needsBgImage = !styles || !isInArray(styles,k,'background-image'),
          type = isImage ? 'image' : needsBgImage ? 'bg' : 'none';
      
      if(shouldBeLoaded) load(this_el,type);
    }
    // remove event listeners if there's nothing in the DOM
    // with a data-src attribute -- our work is done
    if(i <= 0) stop();
  }
  
  function load(el,type){
    switch(type){
      case 'image':
        el.src = el.getAttribute('data-src');
        el.removeAttribute('data-src');
        break;

      case 'bg':
        el.style.backgroundImage = 'url('+el.getAttribute('data-src')+')';
        el.removeAttribute('data-src');
        break;

      // we arrive here if the element has data-src, is in the viewport,
      // isn't an image and doesn't need a background-image
      // unlikely but possible
      default:
        el.removeAttribute('data-src');
    }
  }
  
  function toad(){
    return rebounce(prep());
  }
  
  function start(){
    // Setup event listeners, load anything in the viewport
    addEventHandler('load',prep);
    addEventHandler('scroll',toad);
    addEventHandler('resize',toad);
  }

  function stop(){
    // Stop listening for events to trigger loads
    removeEventHandler('load',prep);
    removeEventHandler('scroll',toad);
    removeEventHandler('resize',toad);
  }
  
  /**
    PUBLIC METHODS
  **/
  win.toad = { startListening: start };

})(window,window.document);
