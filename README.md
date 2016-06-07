toad.js
=======
load images based on viewport visibility

96 sloc &middot; 3.24KB (1.57 KB minified)

this script will pick up anything with an image specified in a `data-src` attribute, detect whether it's an `img` element or any other kind of element, and lazyload the image and apply it when the element is visible in the viewport.

## the rules

- don't supply images with `src` attributes; supply `data-src` attributes instead.

- anything with a `style` attribute specifying a `background` or `background-image` will be **ignored**.

- requestAnimationFrame throttles scroll-triggered and resize-triggered lazyloads for modern browsers


## use

include toad.js

call `toad.init();`

that's it.


## IE support
IE8 due to querySelectorAll.
