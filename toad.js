;( function () {

  window.toad = 
  {
    isImg : function (element)
    {
      return "IMG" === element.tagName ? true : false;
    },
    isInArray : function (arr, i, item) 
    {
      while ( i-- ) { if ( item === arr[i] ) { return true; } }
      return false;
    },
    isInViewport : function (element)
    {
      if ( !element || 1 !== element.nodeType ) { return false; }
      else 
      {
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
    debounce : function (func, wait, scope)
    {
      var timeout;
      return function () {
        var context = scope || this, args = arguments;
        var later = function () {
          timeout = null;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    load : function () 
    {
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
    init : function () 
    {
      if ( "addEventListener" in window )
      {
          document .addEventListener( "DOMContentLoaded", toad.load, false );
          window   .addEventListener( "load",             toad.load, false );
          window   .addEventListener( "scroll",           toad.debounce( toad.load, 100, this ), false );
          window   .addEventListener( "resize",           toad.debounce( toad.load, 100, this ), false );
      }
      else if ( "attachEvent" in window )
      {
          document .attachEvent( "onDOMContentLoaded", toad.load );
          window   .attachEvent( "onload",             toad.load );
          window   .attachEvent( "onscroll",           toad.debounce( toad.load, 100, this ) );
          window   .attachEvent( "onresize",           toad.debounce( toad.load, 100, this ) );
      }
      else
      {
        window.onload   = toad.load;
        window.onscroll = toad.debounce( toad.load, 100, this);
        window.onresize = toad.debounce( toad.load, 100, this);
      }
      toad.load();
    }
  };
}());
