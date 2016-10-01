// this will not work in most browsers
// due to use of passive event listeners & let
;(function(win,doc){

  'use strict';

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
        f.apply(context,args); scheduled = null;
      });
    }
  }

  function prep(){
    let elements = doc.querySelectorAll('[data-src]') || [];

    for(let j = 0; j < elements.length; ++j){
      let this_el = elements[j],
          should_load = !!this_el.getAttribute('data-src') && isInViewport(this_el),
          type = 'img' === this_el.tagName.toLowerCase() ? 'image' : 'bg';

      switch(should_load){
        case true:
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
          break;
      }
    }
    if(elements.length <= 0){
      win.removeEventListener('load',toad,{passive:true});
      win.removeEventListener('scroll',toad,{passive:true});
    }
  }

  function toad(){
    return rebounce(prep());
  }

  win.addEventListener('load',toad,{passive:true});
  win.addEventListener('scroll',toad,{passive:true});

})(window,window.document);
