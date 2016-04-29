(function(){
  function toad(a){
    var i=a.length,
        j=0;
    function addCSSRule(m,n) {
      var s=document.styleSheets[0];
      console.log(m,n);
    	if("insertRule" in s) {
    		s.insertRule("article:nth-child("+(n+1)+"):before{background-image:url("+m+")}",(s.rules.length));
    	}
    	else if("addRule" in s) {
    		s.addRule("article:nth-child("+(n+1)+"):before","background-image:url("+m+")",(s.rules.length));
    	}
    	else{
    	  var cssImages = document.createElement("style"),
        styles="article:nth-child("+(n+1)+"):before{background-image:url("+m+")}";
        cssImages.type = "text/css";
        cssImages.setAttribute("scoped",true);
        cssImages.styleSheet?cssImages.styleSheet.cssText=styles:cssImages.appendChild(document.createTextNode(styles));
        document.head?document.head.appendChild(cssImages):document.getElementsByTagName("head")[0].appendChild(cssImages);
    	}
    }
    function getImage(m,n){
      if(window.fetch){
        fetch(m)
        .then(function(response){
          if (response.ok){
            addCSSRule(m,n);
          }
          else{
            console.error("Error: "+response.message);
          }
        })
        .catch(function(error){
          console.log("Error: "+error.message);
        });
      }
      else{
        var xhr=new XMLHttpRequest();
        xhr.open("GET", image, true);
        xhr.onload=function(e){
          if (xhr.readyState===4){
            if (xhr.status===(200||304)){
              addCSSRule(m,n);
            }
            else{
              console.error(xhr.statusText);
            }
          }
        };
        xhr.onerror=function(e){
          console.error(xhr.statusText);
        };
        xhr.send(null);
      }
    }
    for(;i>j;j++){
      getImage(a[j],j);
    }
  }
  window.toad=toad;
}());
