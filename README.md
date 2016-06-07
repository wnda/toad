toad.js
=======
load images based on viewport visibility

can be used for images and CSS background images

## use

don't supply images with `src` attributes; supply `data-src` attributes instead.

include toad.js

call `toad.init();`

optionally call 

    toad.init({
        bgImg : // boolean, true = load images as background images, so use false or no config object for img src 
    });
