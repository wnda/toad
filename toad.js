/* https://gist.github.com/paulirish/1579671 */
;(function(){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
  
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* toad.js */
(function(){
  
  "use strict";
  
  // first, browser support
  Document.prototype.getElementsByAttribute
  =
  Element.prototype.getElementsByAttribute
  =
  function(attr)
  {
    var nodeList = this.getElementsByTagName( "*" ),
        i = nodeList.length,
        j = 0,
        nodeArray = [];
    for (; i > j; j++)
    {
      !!nodeList[j].getAttribute( attr ) && nodeArray.push( nodeList[j] );
    }
    return nodeArray;
  };
  
  window.toad =
  {
    // lets define some helpers
    isImg : function ( el ){
      if ( !el || 1 !== el.nodeType ) return false;
      if ( "IMG" !== el.tagName ) return false;
      return !el.src;
    },
    
    isInArray : function ( arr, i, item ){
      while ( i-- )
      {
        if ( item === arr[i] ) return true;
      }
      return false;
    },
    
    isInViewport : function ( el ){
      if ( !el || 1 !== el.nodeType ) return false;
      var w = ( window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth  ),
          h = ( window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight ),
          r = el.getBoundingClientRect();
      return (
        !!r
        && r.bottom > 0
        && r.right  > 0
        && r.top    < h
        && r.left   < w
      );
    },
    
    rebounce : function(func){
      // standard debouncing option using requestAnimationFrame, which we shimmed above
      var timeout, args, context;
      return function (){
        context = this;
        args = [].slice.call( arguments, 0 );
        cancelAnimationFrame( timeout );
        timeout = requestAnimationFrame( function (){
          func.apply( context, args );
          timeout = null;
        });
      }
    },
    
    debounce : function(func, wait){
      // legacy debounce method for testing
      var timeout, args, context, timestamp;
      
      wait = !!wait ? wait : 100;
      return function ()
      {
        context = this;
        args = [].slice.call( arguments, 0 );
        timestamp = new Date();
        var later = function()
        {
          var last = ( new Date() ) - timestamp;
          if ( last < wait )
          {
            timeout = setTimeout(later, wait - last);
          }
          else
          {
            func.apply( context, args );
            timeout = null;
          }
        };
        if (!timeout)
        {
          timeout = setTimeout(later, wait);
        }
      }
    },
    
    load : function (){
      // get everything with data-src attribute, prepare to iterate
      // getElementsByAttribute in case querySelectorAll is not supported
      var elements  = document.querySelectorAll( "[data-src]" ) || document.getElementsByAttribute( "data-src" ),
          i         = elements.length,
          j         = 0;
          
      for ( ; i > j; j++)
      { // iterate over retrieved elements
        var styles         = !!elements[j].getAttribute("style") ? elements[j].getAttribute("style").split(":") : false,
            k              = !!styles ? styles.length : 0,
            shouldBeLoaded = !!elements[j].getAttribute( "data-src" ) && !!toad.isInViewport( elements[j] ),
            asImg          = !!toad.isImg( elements[j] ),
            asBgImg        = !!( !styles || !toad.isInArray( styles, k, "background-image" ) );
        
        if ( !!shouldBeLoaded )
        {
          
          if ( !!asImg ) 
          { // is an image and needs a src
            elements[j].src = elements[j].getAttribute( "data-src" );
          }
          
          else if ( !!asBgImg ) 
          { // is not an image and needs a background image
            elements[j].style.backgroundImage = "url(" + elements[j].getAttribute( "data-src" ) + ")";
          }
          
          else
          {
            elements[j].removeAttribute( "data-src" );
          }
          
        }
        
      }
    },
    
    init : function ( config ){
      var debounceMethod = ( !!config && !!config.useLegacyDebounce ? "debounce" : "rebounce" );
      // setup event listeners, load anything in the viewport
      if ( "addEventListener" in window )
      { // add events in IE9+
        window.addEventListener( "load",   toad.load, false );
        window.addEventListener( "scroll", toad[ debounceMethod ]( toad.load ), false );
        window.addEventListener( "resize", toad[ debounceMethod ]( toad.load ), false );
      }
      else if ( "attachEvent" in window )
      { // add events in IE8
        window.attachEvent( "onload",   toad.load );
        window.attachEvent( "onscroll", toad[ debounceMethod ]( toad.load, 100 ) );
        window.attachEvent( "onresize", toad[ debounceMethod ]( toad.load, 100 ) );
      }
      else
      { // add events in ancient browsers
        window.onload   = toad.load;
        window.onscroll = toad[ debounceMethod ]( toad.load, 100 );
        window.onresize = toad[ debounceMethod ]( toad.load, 100 );
      }
    }
  };
  
} ) ();
