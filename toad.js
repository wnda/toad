/* toad.js */
var toad = (function(){
  
  'use strict';
  
  // first, extreme browser support
  Document.prototype.getElementsByAttribute 
  = Element.prototype.getElementsByAttribute 
  = function ( attr ){
    var nodeList = this.getElementsByTagName( '*' ),
        i = nodeList.length,
        j = 0,
        nodeArray = [];
    for (; i > j; j++)
    {
      !!nodeList[j].getAttribute( attr ) && nodeArray.push( nodeList[j] );
    }
    return nodeArray;
  };
  
  // requestAnimationFrame shim
  if ( !window.requestAnimationFrame ) {
  	window.requestAnimationFrame = ( function() {
  		return window.webkitRequestAnimationFrame ||
  		       window.mozRequestAnimationFrame ||
          	 window.oRequestAnimationFrame ||
          	 window.msRequestAnimationFrame ||
          	 function( callback, element ) {
               window.setTimeout( callback, 1000 / 60 );
  		       };
  	} ) ();
  }
  
  // cancelAnimationFrame shim
  if ( !window.cancelAnimationFrame )
  {
      window.cancelAnimationFrame = ( function() {
    		return window.cancelRequestAnimationFrame ||
    		       window.mozCancelAnimationFrame ||
            	 window.oCancelAnimationFrame ||
            	 window.msCancelAnimationFrame ||
            	 function( id ) {
                 window.cancelTimeout( id );
    		       };
    	} ) ();
  } 
  
  /**
    PRIVATE METHODS i.e. HELPER FUNCTIONS
  **/
  // Detect if the element an image for toad to load
  var isImg = function ( el ){
    if ( !el || 1 !== el.nodeType ) return false;
    if ( "IMG" !== el.tagName ) return false;
    return !el.src;
  };
  
  // Detect whether something is in an array of somethings
  // This is used to detect the presence of background-image in an element's attribute styles
  var isInArray = function ( arr, i, item ){
    while ( i-- )
    {
      if ( item === arr[i] ) return true;
    }
    return false;
  };
  
  // Detect if an element is in the viewport
  // This is really quite obvious really
  var isInViewport = function ( el ){
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
  };
  
  // Use requestAnimationFrame to throttle the execution of a function
  // This is our drop-in alternative to _.debounce or _.throttle to leverage
  // the new requestAnimationFrame API
  var rebounce = function( func ){
    // standard debouncing option using requestAnimationFrame, which we shimmed above
    var timeout, args, context;
    return function (){
      context = this;
      args = [].slice.call( arguments, 0 );
      window.cancelAnimationFrame( timeout );
      timeout = window.requestAnimationFrame( function (){
        func.apply( context, args );
        timeout = null;
      });
    }
  };
  
  return
  {
    /**
      PUBLIC METHODS
    **/
    // Load images & background images
    load : function (){
      // get everything with data-src attribute, prepare to iterate
      // getElementsByAttribute in case querySelectorAll is not supported
      var elements  = document.querySelectorAll( "[data-src]" ) || document.getElementsByAttribute( "data-src" ),
          i         = elements.length,
          j         = 0;
          
      if ( !i ) 
      {
        if ( "addEventListener" in window ) window.removeEventListener( "load", toad.load, false );
        else if ( "attachEvent" in window ) window.detachEvent( "onload",   toad.load );
        else window.onload = null;
      }
          
      for ( ; i > j; j++)
      { // iterate over retrieved elements
        var styles         = !!elements[j].getAttribute( "style" ) ? elements[j].getAttribute( "style" ).split( ":" ) : false,
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
    
    // start listening for events to trigger loads
    startListening : function (){
      
      // setup event listeners, load anything in the viewport
      if ( "addEventListener" in window )
      { // add events in normal browsers & IE9+
        window.addEventListener( "load",   toad.load, false );
        window.addEventListener( "scroll", rebounce( toad.load ), false );
        window.addEventListener( "resize", rebounce( toad.load ), false );
      }
      
      else if ( "attachEvent" in window )
      { // add events in IE8...
        window.attachEvent( "onload",   toad.load );
        window.attachEvent( "onscroll", rebounce( toad.load ) );
        window.attachEvent( "onresize", rebounce( toad.load ) );
      }
      
      else
      { // add events in ancient browsers
        window.onload   = toad.load;
        window.onscroll = rebounce( toad.load );
        window.onresize = rebounce( toad.load );
      }
    },
    
    // Stop listening for events to trigger loads
    // This is automatically triggered when all of the elements with a data-src attribute
    // are loaded. If you intend to add content to the page, using this would be ill-advised.
    stopListening : function (){
      
      if ( "addEventListener" in window )
      { // remove events in normal browsers & IE9+
        window.removeEventListener( "scroll", rebounce( toad.load ), false );
        window.removeEventListener( "resize", rebounce( toad.load ), false );
      }
      
      else if ( "attachEvent" in window )
      { // remove events in IE8...
        window.detachEvent( "onscroll", rebounce( toad.load ) );
        window.detachEvent( "onresize", rebounce( toad.load ) );
      }
      
      else
      { // remove events in ancient browsers
        window.onscroll = null;
        window.onresize = null;
      }
      
    }
  };
  
} ) ();
