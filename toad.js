void function (win, doc) {

  'use strict';
  
  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = (function () {
      return win.webkitRequestAnimationFrame
          || win.mozRequestAnimationFrame
          || win.oRequestAnimationFrame
          || win.msRequestAnimationFrame
          || function(callback){return win.setTimeout(callback,1000/60)};
    })();
  }
  
  if (!win.cancelAnimationFrame) {
    win.cancelAnimationFrame = (function () {
      return win.webkitCancelRequestAnimationFrame
          || win.mozCancelAnimationFrame
          || win.oCancelAnimationFrame
          || win.msCancelAnimationFrame
          || function(id){return win.cancelTimeout(id)};
    })();
  }
  
  function addEventHandler (ev, h) {
    win.addEventListener ?
      win.addEventListener(ev, h, !1) : 
        win.attachEvent ? 
          win.attachEvent('on' + ev, h) : 
            win['on' + ev] = h;
  }
  
  function removeEventHandler (ev, h) {
    win.removeEventListener ?
      win.removeEventListener(ev, h, !1) : 
        win.detachEvent ? 
          win.detachEvent('on' + ev, h) : 
            win['on' + ev] = null;
  }

  function isInViewport (el) {
    var r = el.getBoundingClientRect();
    return r.top >= 0 && r.left >= 0 && r.top <= win.innerHeight;
  }

  function rebounce (f) {
    var scheduled, context, args, len, i;
    return function () {
      context = this; 
      args = [];
      len = args.length = arguments.length; i = 0;
      for(;i < len; ++i) {
        args[i] = arguments[i];
      }
      if (!!scheduled) {
        win.cancelAnimationFrame(scheduled);
      }
      scheduled = win.requestAnimationFrame(function () {
        f.apply(context, args); scheduled = null;
      });
    }
  }

  function toad () {
    var elements = doc.querySelectorAll('[data-src]') || [],
        len = elements.length,
        j = 0;

    for (; j < len; ++j) {
      var this_el = elements[j],
          should_load = !!this_el.getAttribute('data-src') && isInViewport(this_el),
          type = 'img' === this_el.tagName.toLowerCase() ? 'image' : 'bg';

      switch (should_load) {
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
    if (elements.length <= 0) {
      removeEventHandler('load', rebounce(toad));
      removeEventHandler('scroll', rebounce(toad));
      removeEventHandler('resize', rebounce(toad));
    }
  }
  
  function start () {
    addEventHandler('load', rebounce(toad));
    addEventHandler('scroll', rebounce(toad));
    addEventHandler('resize', rebounce(toad));
  }

  win.toad = {
    startListening: start
  };

} (window, window.document);
