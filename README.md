toad.js
=======
lazyload images based on viewport visibility

toad.next.js uses passive event listeners and `let`. it also carries a lighter memory footprint, and represents a drop-in solution to the problem of lazyloading images/bg-images. by drop-in I mean that this library attaches its event handlers, where the full-size library will wait for a function call before wiring up its event handlers.

toad.js represents the more robust, IE8-compatible library.
