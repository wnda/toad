/* toad.leanest.js */
// this version polyfills and shims nothing
// you'll be lucky if this works anywhere other than chrome 49 OOTB
// due to passive event listeners being used

// pass in window, window.document
;(function(win,doc){

  'use strict';
  
  function isInArray(arr,i,item){
    while(i--) if(item === arr[i]) return true;
    return false;
  }
  
  function isInViewport(el){
    let r = el.getBoundingClientRect();
    return r.top >= 0 && r.left >= 0 && r.top <= win.innerHeight;
  }

  function rebounce(f){
    var scheduled, context, args;
    return function(){
      context = this; args = [];
      args.length = arguments.length;
      for(let i = 0; i < arguments.length; ++i) args[i] = arguments[i];
      win.cancelAnimationFrame(scheduled);
      scheduled = win.requestAnimationFrame(function(){
        f.apply(context, args);
        scheduled = null;
      });
    }
  }
  
  function prep(){
    let elements = doc.querySelectorAll('[data-src]') || [];

    for(let j = 0; j < elements.length; ++j){
      let this_el = elements[j],
          styles = !!this_el.getAttribute('style') ? this_el.getAttribute('style').split(':') : [],
          k = styles.length,
          type = (('img' === this_el.tagName.toLowerCase() && !this_el.src) ? 'image' : (!styles || !isInArray(styles,k,'background-image')) ? 'bg' : 'none');
          
      if(!!this_el.getAttribute('data-src') && isInViewport(this_el)){
        switch(type){
          case 'image':
            this_el.src = this_el.getAttribute('data-src');
            this_el.removeAttribute('data-src');
            break;
          case 'bg':
            this_el.style.backgroundImage = 'url(' + this_el.getAttribute('data-src') + ')';
            this_el.removeAttribute('data-src');
            break;
          default:
            this_el.removeAttribute('data-src');
        }
      }   
    }
    if(elements.length <= 0){
      win.removeEventListener('load',prep,{passive:true});
      win.removeEventListener('scroll',toad,{passive:true});
    }
  }
  
  
  function toad(){
    return rebounce(prep());
  }
  
  win.addEventListener('load',prep,{passive:true});
  win.addEventListener('scroll',toad,{passive:true});
  
})(window,window.document);
