/* toad.js */
;(function(win,doc){

  var isInArray = function (arr,i,item){
    while(i--) if(item === arr[i]) return true;
    return false;
  };
  
  var isInViewport = function(el){
    var r = el.getBoundingClientRect(), wh = (win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight);
    return (r.top >= 0 && r.left >= 0 && r.top <= wh);
  };
  
  var rebounce = function(f){
    var scheduled, context, args, len, i;
    return function(){
      context = this; args = [];
      len = args.length = arguments.length; i = 0;
      for(; i < len; ++i) args[i] = arguments[i];
      win.cancelAnimationFrame(scheduled);
      scheduled = win.requestAnimationFrame(function(){
        f.apply(context, args);
        scheduled = null;
      });
    }
  };
  
  var toad = function(){
    var elements = doc.querySelectorAll('[data-src]') || [],
        i = elements.length, j = 0;

    for(; i > j; ++j){
      var styles = !!elements[j].getAttribute('style') ? elements[j].getAttribute('style').split(':') : false,
          k = !!styles ? styles.length : 0,
          shouldBeLoaded = !!elements[j].getAttribute('data-src') && !!isInViewport(elements[j]),
          isImage = ('img' === elements[j].tagName.toLowerCase() && !elements[j].src),
          needsBgImage = (!styles || !isInArray(styles,k,'background-image')),
          type = isImage ? 'image' : (needsBgImage ? 'bg' : 'none');
      
      if(!!shouldBeLoaded){
        switch(type){
          case 'image':
            elements[j].src = elements[j].getAttribute('data-src');
            elements[j].removeAttribute('data-src');
            break;
            
          case 'bg':
            elements[j].style.backgroundImage = 'url('+elements[j].getAttribute('data-src')+')';
            elements[j].removeAttribute('data-src');
            break;

          default:
            elements[j].removeAttribute('data-src');
        }
      }
    }
    if(!i){
      win.removeEventListener('load',toad,{passive:true});
      win.removeEventListener('scroll',rebounce(toad),{passive:true});
      win.removeEventListener('resize',rebounce(toad),{passive:true});
    }
  };
  
  win.addEventListener('load',toad,{passive:true});
  win.addEventListener('scroll',rebounce(toad),{passive:true});
  win.addEventListener('resize',rebounce(toad),{passive:true});
      
})(window,window.document);
