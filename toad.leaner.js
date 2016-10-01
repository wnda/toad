/* toad.lean.js */
;(function(win,doc){
    
  function isInArray(arr,i,item){
    while(i--) if(item === arr[i]) return true;
    return false;
  }
  
  function isInViewport(el){
    var r = el.getBoundingClientRect(), wh = (win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight);
    return r.top >= 0 && r.left >= 0 && r.top <= wh;
  }
  
  function rebounce(f){
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
  }
  
  function prep(){
    var elements = doc.querySelectorAll('[data-src]') || doc.getElementsByAttribute('data-src'),
        i = elements.length, j = 0;

    for(; i > j; ++j){
      var this_el = elements[j],
          styles = !!this_el.getAttribute('style') ? this_el.getAttribute('style').split(':') : false,
          k = !!styles ? styles.length : 0,
          shouldBeLoaded = !!this_el.getAttribute('data-src') && isInViewport(this_el),
          isImage = 'img' === this_el.tagName.toLowerCase() && !this_el.src,
          needsBgImage = !styles || !isInArray(styles,k,'background-image'),
          type = isImage ? 'image' : needsBgImage ? 'bg' : 'none';
      
      if(shouldBeLoaded) load(this_el,type);
    }
    if(i <= 0) stop();
  }
  
  function load(el,type){
    switch(type){
      case 'image':
        el.src = el.getAttribute('data-src');
        el.removeAttribute('data-src');
        break;

      case 'bg':
        el.style.backgroundImage = 'url(' + el.getAttribute('data-src') + ')';
        el.removeAttribute('data-src');
        break;

      default:
        el.removeAttribute('data-src');
    }
  }
  
  function toad(){
    return rebounce(prep());
  }
  
  function start(){
    win.addEventListener('load',prep);
    win.addEventListener('scroll',toad);
    win.addEventListener('resize',toad);
  }

  function stop(){
    win.removeEventListener('load',prep);
    win.removeEventListener('scroll',toad);
    win.removeEventListener('resize',toad);
  }
  
  win.toad = {
    startListening: start
  };
})(window,window.document);
