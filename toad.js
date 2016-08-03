;(function(){ 
  
  // true warriors always use strict
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
  
  // let's just sneak this in here
  if( !window.requestAnimationFrame )
  {
    window.requestAnimationFrame =
    (function(){
      return  window.requestAnimationFrame           ||
              window.webkitRequestAnimationFrame     ||
              window.mozRequestAnimationFrame        ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  }

  window.toad =
  {
    // lets define some helpers

    isImg : function ( el ){

      return "IMG" === el.tagName ? true : false;

    },

    isInArray : function ( arr, i, item ){

      // can't use in operator, so...

      while ( i-- ) { if ( item === arr[i] ) { return true; } }

      return false;

    },

    isInViewport : function ( el ){

      // kind of important...

      if ( !el || 1 !== el.nodeType )
      {
        return false;
      }

      else
      {
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
      }

    },

    rebounce : function(func){

      // standard debouncing option using requestAnimationFrame shimmed above

      var ticking, args, context;

      return function (){

        if ( !!ticking ) return;

        ticking = true;
        args = arguments;
        context = this;

        requestAnimationFrame( function (){

          ticking = false;

          func.apply(context, args);

        });
      }
    },

    debounce : function(func, wait){

      // because requestAnimationFrame isn't available everywhere

      var timeout, args, context, timestamp;

      return function()
      {
        context = this;
        args = [].slice.call(arguments, 0);
        timestamp = new Date();

        var later = function()
        {
          var last = (new Date()) - timestamp;

          if (last < wait)
          {
            timeout = setTimeout(later, wait - last);
          }
          else
          {
            timeout = null;
            func.apply(context, args);
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

      var elements  = document.querySelectorAll( "[data-src]" ) || document.getElementsByAttribute( "data-src" ),
          i         = elements.length,
          j         = 0;

      for ( ; i > j; j++)
      { // holy shit

        if ( !!elements[j].getAttribute( "data-src" ) && !!toad.isInViewport( elements[j] ) )
        { // has data-src and is in viewport

          if ( !!elements[j].getAttribute( "style" ) )
          { // has style attribute set

            var styles = elements[j].getAttribute("style").split(":"),
                k      = styles.length;

            if ( !toad.isInArray( styles, k, "background-image" ) )
            { // has no backgroundImage set

              if ( !!toad.isImg( elements[j] ) )
              { // is image
                elements[j].src = elements[j].getAttribute( "data-src" );
              }

              else
              { // is not image and has no background image set
                elements[j].style.backgroundImage = "url(" + elements[j].getAttribute( "data-src" ) + ")";
              }
            }

            else
            { // has background-image already set
              elements[j].removeAttribute( "data-src" );
            }

          }

          else
          { // has no style attribute set, but has data-src and is in viewport

            if ( !!toad.isImg( elements[j] ) )
            { // is image

              if ( elements[j].getAttribute( "data-src" ) !== elements[j].src )
              { // src is empty or data-src does not match src attribute
                elements[j].src = elements[j].getAttribute( "data-src" );
              }

              else
              { // data-src and src are same; remove data-src to prevent rechecking
                elements[j].removeAttribute( "data-src" );
              }

            }

            else
            { // not an image, but is in viewport, has data-src and has no attribute styles
              elements[j].style.backgroundImage = "url(" + elements[j].getAttribute( "data-src" ) + ")";
            }

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

  return toad;

})();
