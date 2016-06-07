;(function(){
  
  var settings;
  
  window.toad = {
  
    isInViewport : function ( element )
    {
      if ( !element || 1 !== element.nodeType )
      {
        return false;
      }
  
      var r = element.getBoundingClientRect();
  
      return (
        !!r
        && r.bottom > 0
        && r.right  > 0
        && r.top    < ( window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight )
        && r.left   < ( window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth  )
      );
    },
    
    load : function ()
    {
      var elements  = !settings.bgImg ? document.getElementsByTagName("img") : document.querySelectorAll("[data-src]"),
          i         = elements.length,
          j         = 0;
  
      for ( ; i > j; j++)
      {
        if ( !!toad.isInViewport( elements[j] ) )
        {
          if ( !!settings.bgImg )
          {
            elements[j].style.backgroundImage = decodeURIComponent( elements[j].getAttribute( "data-src" ) );
          }
          else
          {
            elements[j].src = decodeURIComponent( elements[j].getAttribute( "data-src" ) );
          }
        }
      }
  
    },
    
    init : function (config)
    {
      settings = {
        bgImg : config && config.bgImg && "boolean" === typeof config.bgImg ? config.bgImg : false 
      };
      
      if ( window.addEventListener )
      {
          document .addEventListener( "DOMContentLoaded", toad.load, false );
          window   .addEventListener( "load",             toad.load, false );
          window   .addEventListener( "scroll",           toad.load, false );
          window   .addEventListener( "resize",           toad.load, false );
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
  
}());
