toad.js
=======

this is a work in progress based on something I just made for a specific case. generalising it to any case needs to be done before the lib can be considered useful.

each of these parameters will be a URL to an image that you wish to load asynchronously and apply as a background-image dynamically.
    
each image will be applied asynchronously as a background-image to the elements you specify.

this works by trying to fetch the resources using fetch(), or where there is no fetch, we use XHR. we then append styling information or a whole secondary stylesheet containing the new rules which will stipulate the background-image.


api
------

initialise the function with the config object, specifying the selector and the image to associate with it.

the selector is passed to `querySelectorAll`, so there's no need to send this as an array. and the `images` property is pushed into an array, enabling you to target one element or several that share the same class but need different background-images.

    toad({
        "selector"  :  ".product-grid",
        "images"    :  "http://someurl.com/someimage.jpg,http://someurl.com/anotherimage.jpg,http://someurl.com/you_get_the_idea.jpg"
        
        OR
        
        "images"    :   [
                        "http://someurl.com/someimage.jpg",
                        "http://someurl.com/anotherimage.jpg",
                        "http://someurl.com/you_get_the_idea.jpg"
                        ]
    });
    
you can supply the image URLs in an array or as a comma-delimited list in a single string for simplicity. the lib will detect which you do.

if you have multiple images to apply to separate elements, this selector should occur as many times as you have images in the array below.
