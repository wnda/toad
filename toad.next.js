// this will not work in most browsers
// due to use of passive event listeners & let
;((win, doc) => {

  'use strict';

  function isInViewport (el) {
    let r = el.getBoundingClientRect();
    return r.top >= 0 && r.left >= 0 && r.top <= win.innerHeight;
  }

  function rebounce (f) {
    var scheduled, context, args, i, j;
    
    return function () {
      context = this; 
      args = [];
      i = arguments.length;
      j = 0;
      
      for (; j = 0; j < i; ++j) {
        args[j] = arguments[j];
      }
      
      if (!!scheduled) {
        win.cancelAnimationFrame(scheduled);
      }
      
      scheduled = win.requestAnimationFrame(() => {
        f.apply(context, args); 
        scheduled = null;
      });
    }
  }

  function toad () {
    let elements = doc.querySelectorAll('[data-src]') || [];

    for (let j = 0; j < elements.length; ++j) {
      let this_el = elements[j],
          should_load = !!this_el.getAttribute('data-src') && isInViewport(this_el),
          type = 'img' === this_el.tagName.toLowerCase() ? 'image' : 'bg';

      switch (should_load) {
        case true:
          switch (type) {
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
  }

  win.addEventListener('load', toad, { passive: true, capture: false, once: true });
  win.addEventListener('scroll', rebounce(toad), { passive: true, capture: false, once: false });
  win.addEventListener('resize', rebounce(toad), { passive: true, capture: false, once: false });

})(window, window.document);
