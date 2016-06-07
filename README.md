toad.js
=======
load images based on viewport visibility

67 sloc

can be used for images and CSS background images

## use

don't supply images with `src` attributes; supply `data-src` attributes instead.

include toad.js

call `toad.init();`

optionally call 

    toad.init({
        bgImg : // boolean, true = load images as background images, so use false or no config object for img src 
    });


using with images will work with old IE thanks to `getElementsByTagName`, as the CSS background-image setting requires `querySelectorAll`
