;( function () {

  window.toad = {

    isImg : function ( element ) {
      
      return "IMG" === element.tagName ? true : false;

    },

    isInArray : function ( arr, i, item ) {

      while ( i-- ) { if ( item === arr[i] ) { return true; } }
      return false;
      
    },

    isInViewport : function ( element ) {

      if ( !element || 1 !== element.nodeType ) { return false; }
      else {

        var r = element.getBoundingClientRect();

        return (
          !!r
          && r.bottom > 0
          && r.right  > 0
          && r.top    < ( window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight )
          && r.left   < ( window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth  )
        );
      }

    },
    
    throttleLoad : function () {
      
      if ( !window.requestAnimationFrame ) {
      	window.requestAnimationFrame = 
      	( function () {
      		return 
      		   window.webkitRequestAnimationFrame
      		|| window.mozRequestAnimationFrame
      		|| window.oRequestAnimationFrame
      		|| window.msRequestAnimationFrame
      		|| function( callback, element ) { window.setTimeout( callback, 1000 / 60 ); };
      	} ) ();
      }
      
      window.requestAnimationFrame(toad.load);
      
    },

    load : function () {

      var elements  = document.querySelectorAll("[data-src]"),
          i         = elements.length,
          j         = 0;

      for ( ; i > j; j++)
      {
        if ( !!elements[j].getAttribute( "data-src" ) && !!toad.isInViewport( elements[j] ) )
        {
          if ( elements[j].hasAttribute( "style" ) )
          {
            var styles = elements[j].getAttribute("style").split(":"),
                k      = styles.length;
                
            if ( !toad.isInArray( styles, k, "background-image" ) )
            {
              if ( !!toad.isImg( elements[j] ) )
              {
                elements[j].src = elements[j].getAttribute( "data-src" );
              }
              else
              {
                elements[j].style.backgroundImage = "url(" + elements[j].getAttribute( "data-src" ) + ")";
              }
            }
            else
            {
              elements[j].removeAttribute( "data-src" );
            }
          }
          else
          {
            if ( !!toad.isImg( elements[j] ) )
            {
              if ( elements[j].getAttribute( "data-src" ) !== elements[j].src  )
              {
                elements[j].src = elements[j].getAttribute( "data-src" );  
              }
              else
              {
                elements[j].removeAttribute( "data-src" );
              }
              
            }
            else
            {
              elements[j].style.backgroundImage = "url(" + elements[j].getAttribute( "data-src" ) + ")";
            }
          }
        }
      }

    },

    init : function (config) {

      if ( window.addEventListener )
      {
          document .addEventListener( "DOMContentLoaded", toad.load, false );
          window   .addEventListener( "load",             toad.load, false );
          window   .addEventListener( "scroll",           toad.throttleLoad, false );
          window   .addEventListener( "resize",           toad.throttleLoad, false );
      }
      else if ( window.attachEvent )
      {
          document .attachEvent( "onDOMContentLoaded", toad.load );
          window   .attachEvent( "onload",             toad.load );
          window   .attachEvent( "onscroll",           toad.load );
          window   .attachEvent( "onresize",           toad.load );
      }
      else
      {
        window.onload   = toad.load;
        window.onscroll = toad.load;
        window.onresize = toad.load;
      }

      toad.load();

    }

  };

} () );
