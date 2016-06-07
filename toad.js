(function(){

  var settings;

  window.toad = {

    isInViewport : function(element){

      if( !element || 1 !== element.nodeType ){
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

    },

    addCSSRule : function(m){

      var v=document.querySelectorAll(config.selector),
          r=v.length,
          w=0,
          s=document.styleSheets[0];

      for (; r > w ; w++)
      {

        if ( isInViewport( v[w] ) )
        {

        	if ("insertRule" in s)
        	{
        		s.insertRule(v[w]+"{background-image:url("+m+")}",(s.rules.length));
        	}
        	else if ("addRule" in s)
        	{
        		s.addRule(v[w],"background-image:url("+m+")",(s.rules.length));
        	}
        	else
        	{
        	  var cssImages=document.createElement("style"),
            styles=v[w]+"{background-image:url("+m+")}";
            cssImages.type="text/css";
            cssImages.styleSheet?cssImages.styleSheet.cssText=styles:cssImages.appendChild(document.createTextNode(styles));
            document.head?document.head.appendChild(cssImages):document.getElementsByTagName("head")[0].appendChild(cssImages);
        	}

        }

      }

    },

    applyBgImg : function(){

      var i=settings.images.length,
          j=0;

      for(;i>j;j++)
      {

        if(window.addEventListener)
        {
            document.addEventListener( "DOMContentLoaded", addCSSRule( i[j], e ), false );
            window.addEventListener( "load", addCSSRule( i[j], e ), false );
            window.addEventListener( "scroll", addCSSRule( i[j], e ), false );
            window.addEventListener( "resize", addCSSRule( i[j], e ), false );
        }
        else if(window.attachEvent)
        {
            document.attachEvent( "onDOMContentLoaded", addCSSRule( i[j], e ) );
            window.attachEvent( "onload", addCSSRule( i[j], e ) );
            window.attachEvent( "onscroll", addCSSRule( i[j], e ) );
            window.attachEvent( "onresize", addCSSRule( i[j], e ) );
        }
        else
        {
          window.onload   = addCSSRule( i[j], e);
          window.onscroll = addCSSRule( i[j], e);
          window.onresize = addCSSRule( i[j], e);
        }

      }

    },

    init : function(config){

      settings = {

        selector : config && config.selector ? config.selector : ".toad",
        images   : config && config.images ?
                   (typeof config.images === "string" ?
                     config.images.split(",")
                     : config.images)
                   : []

      };

      applyBgImg();

    }

  };

}());
