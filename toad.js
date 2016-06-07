;(function(){

  function toad ()
  {

    function isInViewport ( element )
    {

      if ( !element || 1 !== element.nodeType )
      {
        return false;
      }

      var r = l.getBoundingClientRect();

      return (
        !!r
        && r.bottom > 0
        && r.right  > 0
        && r.top    < ( window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight )
        && r.left   < ( window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth  )
      );

    }

    var elements  = document.querySelectorAll("[data-src]"),
        i         = elements.length,
        j         = 0;

    for ( ; i > j; j++)
    {

      if ( !!isInViewport( elements[j] ) )
      {
        elements[w].style.backgroundImage = decodeURIComponent(elements[w].dataset.src);
      }

    }

  }
  
  if ( window.addEventListener )
  {
      document.addEventListener( "DOMContentLoaded", toad, false );
      window.addEventListener( "load", toad, false );
      window.addEventListener( "scroll", toad, false );
      window.addEventListener( "resize", toad, false );
  }
  else if ( window.attachEvent )
  {
      document.attachEvent( "onDOMContentLoaded", toad );
      window.attachEvent( "onload", toad );
      window.attachEvent( "onscroll", toad );
      window.attachEvent( "onresize", toad );
  }
  else
  {
    window.onload   = toad;
    window.onscroll = toad;
    window.onresize = toad;
  }

}());
