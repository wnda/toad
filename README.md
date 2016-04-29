# toad.js

this is a work in progress based on something I just made for a specific case. generalising it to any case needs to be done before the lib can be considered useful.

each of these parameters will be a URL to an image that you wish to load asynchronously and apply as a background-image dynamically.
    
each image will be applied asynchronously as a background-image to the elements you specify.

this works by trying to fetch the resources using fetch(), or where there is no fetch, we use XHR. we then append styling information or a whole secondary stylesheet containing the new rules which will stipulate the background-image.
