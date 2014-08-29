(function() {
    "use strict";
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                      window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* global define, module */
(function (factory) {
    "use strict";
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define('jquery-in-view', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function($) {
    "use strict";

    $.fn.inView = function() {
        var callback = function() {
            this.each(function() {
                var inViewTop, inViewBottom,
                    $el = $(this),
                    scrollTop = $(window).scrollTop(),
                    offset = $el.offset();

                inViewTop = offset.top >= scrollTop &&
                            offset.top < scrollTop + window.innerHeight;

                inViewBottom = offset.top + $el.height() > scrollTop &&
                               offset.top + $el.height() <= scrollTop + window.innerHeight;

                $el.toggleClass('in-view in-view--whole', inViewTop && inViewBottom);
                $el.toggleClass('in-view in-view--partial', inViewTop || inViewBottom);
                $el.toggleClass('in-view in-view--top', inViewTop);
                $el.toggleClass('in-view in-view--bottom', inViewBottom);
            });
        }.bind(this)

        $(window).on('scroll.jquery-in-view', function() {
            window.requestAnimationFrame(callback);
        }).trigger('scroll.jquery-in-view');

        return this;
    };
}));
