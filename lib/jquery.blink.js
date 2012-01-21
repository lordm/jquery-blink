/**
 * Basic usage (Most common settings. {no max blinks = blink indefinitely, blinkDuration ~1 sec, no callback}):
 *
 *      $('selector').blink();
 *
 * Advanced usage:
 * 
 *      $('selector').blink({maxBlinks: 60, blinkPeriod: 1000, speed: 'slow', onMaxBlinks: function(){}, onBlink: function(){}}); 
*/

(function( $ ) {
  $.fn.blink = function( options ) {

    var settings = {
      maxBlinks     : undefined,
      blinkPeriod   : 1000,
      onMaxBlinks   : function(){},
      onBlinkOn     : function(i, callback){
                        this.fadeTo(settings.speed, 0.01, function(){
                          callback && callback();
                        });
                      },
      onBlinkOff    : function(i, callback){
                        this.fadeTo(settings.speed, 1, function(){
                          callback && callback();
                        });
                      },
      speed         : undefined
    };

    if(options) {
      $.extend(settings, options);
    }

    var blinkElem = this;
    var on = true;
    var blinkCount = 0;
    settings.speed = settings.speed ? settings.speed : settings.blinkPeriod/2;

    /* The function that does the actual fading. */
    (function toggleFade() {
      var maxBlinksReached = false;
      if(on){
        settings.onBlinkOn.call(blinkElem, blinkCount);
      } else {
        blinkCount++;
        maxBlinksReached = (settings.maxBlinks && (blinkCount >= settings.maxBlinks));
        settings.onBlinkOff.call(blinkElem, blinkCount, function(){
          if(maxBlinksReached) {
            settings.onMaxBlinks.call();
          }
        });
      }
      on = !on;

      if(!maxBlinksReached) {
        setTimeout(toggleFade, settings.blinkPeriod/2); // #3
      }
    })();

    return this; // Returning 'this' to maintain chainability.
  };
})(jQuery);
