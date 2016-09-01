'use strict';

var Boxzilla = require('boxzilla');
var options = window.boxzilla_options;
var isLoggedIn = document.body.className.indexOf('logged-in') > -1;

// print message when test mode is enabled
if( isLoggedIn && options.testMode ) {
    console.log( 'Boxzilla: Test mode is enabled. Please disable test mode if you\'re done testing.' );
}

// init boxzilla
Boxzilla.init();

// create boxes from options
for( var i=0; i < options.boxes.length; i++ ) {
    // get opts
    var boxOpts = options.boxes[i];
    boxOpts.testMode = isLoggedIn && options.testMode;

    // fix http:// links in box content....
    if( window.location.origin.substring(0, 5) === "https" ) {
        boxOpts.content = boxOpts.content.replace(window.location.origin.replace("https", "http"), window.location.origin);
    }

    // create box
    var box = Boxzilla.create( boxOpts.id, boxOpts);
        
    // add custom css to box
    css(box.element, boxOpts.css);

    box.element.firstChild.firstChild.className += " first-child";
    box.element.firstChild.lastChild.className += " last-child";
}

// helper function for setting CSS styles
function css(element, styles) {
    if( styles.background_color ) {
        element.style.background = styles.background_color;
    }

    if( styles.color ) {
        element.style.color = styles.color;
    }

    if( styles.border_color ) {
        element.style.borderColor = styles.border_color;
    }

    if( styles.border_width ) {
        element.style.borderWidth = parseInt(styles.border_width) + "px";
    }

    if( styles.border_style ) {
        element.style.borderStyle = styles.border_style;
    }

    if( styles.width ) {
        element.style.maxWidth = parseInt(styles.width) + "px";
    }
}

/**
 * If a MailChimp for WordPress form was submitted, open the box containing that form (if any)
 *
 * TODO: Just set location hash from MailChimp for WP?
 */
window.addEventListener('load', function() {
    if( typeof(window.mc4wp_forms_config) === "object" && window.mc4wp_forms_config.submitted_form ) {
        var selector = '#' + window.mc4wp_forms_config.submitted_form.element_id;
        var boxes = Boxzilla.boxes;
        for( var boxId in boxes ) {
            if(!boxes.hasOwnProperty(boxId)) { continue; }
            var box = boxes[boxId];
            if( box.element.querySelector(selector)) {
                box.show();
                return;
            }
        }
    }
});

window.Boxzilla = Boxzilla;