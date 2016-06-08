toad.js
=======
load images based on viewport visibility

115 sloc &middot; 3.8KB (1.9 KB minified)

this script will pick up anything with an image specified in a `data-src` attribute, detect whether it's an `img` element or any other kind of element, and lazyload the image and apply it when the element is visible in the viewport.

## the rules

- don't supply images with `src` attributes, unless you're just setting an ajax spinner; use `data-src` attributes to supply the actual images you want to display.

- any element with a `style` attribute specifying a `background-image` already **will be passed over in silence**. use `data-src` for this too.

- `requestAnimationFrame` throttles scroll-triggered and resize-triggered lazyloads in modern browsers and defaults to unthrottled in older browsers

## why this one?
[lazysizes](https://github.com/aFarkas/lazysizes) is cool, but it's not as lean at over 500 lines of code, and it's overkill if you just want to set images and background-images lazily. it also requires an additional extension to handle the latter. it also goes to the trouble of governing CSS transitions, which should be left to your stylesheet for **many** reasons.

finally, no matter what lazysizes does or does not do, it uses regular expressions, which are [considerably slower than iterating over arrays at large scale.](https://web.archive.org/web/20150501131550/http://jsperf.com/finding-components-of-a-url/2)


## use

1. include images, setting `data-src="{{image_url}}"`

2. include toad.js. bottom of the `body` element.

3. below the script include, call `toad.init();`

and that's it. everything else is magic.


## IE support
IE8 due to querySelectorAll.
