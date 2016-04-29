(function(){
  function toad(config){
    
    function addCSSRule(m) {
      
      var r=document.querySelectorAll(config.selector),
          v=r.length,
          w=0,
          s=document.styleSheets[0];
          
      for(;v>w;w++){
      	if("insertRule" in s){
      		s.insertRule(v[w]+"{background-image:url("+m+")}",(s.rules.length));
      	}
      	else if("addRule" in s){
      		s.addRule(v[w],"background-image:url("+m+")",(s.rules.length));
      	}
      	else{
      	  var cssImages=document.createElement("style"),
          styles=v[w]+"{background-image:url("+m+")}";
          cssImages.type="text/css";
          cssImages.setAttribute("scoped",true);
          cssImages.styleSheet?cssImages.styleSheet.cssText=styles:cssImages.appendChild(document.createTextNode(styles));
          document.head?document.head.appendChild(cssImages):document.getElementsByTagName("head")[0].appendChild(cssImages);
      	}
      }
    }
    
    function getImage(m){
      if(window.fetch){
        fetch(m)
        .then(function(response){
          if (response.ok){
            addCSSRule(m);
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
        xhr.open("GET",m,true);
        xhr.onload=function(e){
          if (xhr.readyState===4){
            if (xhr.status===(200||304)){
              addCSSRule(m);
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
    
    var a=[],
        b=(typeof config.images === "string" ? config.images.split(",") : config.images),
        i=a.length,
        j=0;
    
    a.push(b);
    
    for(;i>j;j++){
      getImage(a[j]);
    }
  }
  
  window.toad=toad;
  
}());
