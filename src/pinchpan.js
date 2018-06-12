/*
 * Pinchpan JavaScript Library v0.0.1
 * https://github.com/markuskimius/pinchpan
 *
 * Requires jQuery
 *
 * Copyright Mark K. Kim
 * Released under the Apache license 2.0
 * https://github.com/markuskimius/pinchpan/blob/master/LICENSE
 */
(function($) {
  // Threshold at which a tap becomes a pan (in mahattan distance pixels)
  const PAN_TAP_THRESHOLD = 10;

  // Return the average pageX or pageY
  function avg(touches, what) {
    var sum = 0;

    for(var i = 0; i < touches.length; i++) {
      sum += touches[i][what];
    }

    return sum / touches.length;
  }

  // Return a single-position object that tracks a single touch
  function get_pos(e) {
    const x = e.touches ? avg(e.touches, 'pageX') : e.pageX;
    const y = e.touches ? avg(e.touches, 'pageY') : e.pageY;

    return { pageX:x, pageY:y };
  }

  // Return a double-position object that tracks a double touch
  function get_pos2(e) {
    return [
      { pageX: e.touches[0].pageX, pageY: e.touches[0].pageY },
      { pageX: e.touches[1].pageX, pageY: e.touches[1].pageY }
    ];
  }

  // Return a pan object that tracks change in cartesian coordinates
  function get_pan(is, was) {
    const xdiff = is.pageX - was.pageX;
    const ydiff = is.pageY - was.pageY;

    return {
      dx: xdiff,
      dy: ydiff
    };
  }

  // Return the manhattan distance between two single-position objects
  function get_mdist(a, b) {
    const c = get_pan(a, b);

    return Math.abs(c.dx) + Math.abs(c.dy);
  }

  // Return a pinch object that tracks the average position and change in radius
  function get_pinch(is, was) {
    const avgx = (is[0].pageX + is[1].pageX + was[0].pageX + was[1].pageX) / 4;
    const avgy = (is[0].pageY + is[1].pageY + was[0].pageY + was[1].pageY) / 4;
    const rdiff = get_mdist(is[0], is[1]) - get_mdist(was[0], was[1]);

    return {
      pageX: avgx,
      pageY: avgy,
      dr:   rdiff
    };
  }


  // jQuery extensions
  $.fn.extend({
    /*
     * $(selector).pinch(handler).
     */
    pinch: function(handler) {
      this.on('touchstart', function(e) {
        if(e.touches.length == 2) {
          this.pinch = get_pos2(e);

          // OS should not be using this event
          e.preventDefault();
        }
      });

      this.on('touchmove', function(e) {
        if(this.pinch && e.touches.length == 2) {
          const pos = get_pos2(e);

          e.pinch = get_pinch(pos, this.pinch);
          this.pinch = pos;

          handler.apply(this, arguments);
        }
      });

      this.on('wheel mousewheel', function(e) {
        const oe = e.originalEvent ? e.originalEvent : {};
        const zf = (oe.deltaMode == 0) ? 1 : 20;
        const delta = -oe.deltaY * zf;

        // deltaMode 0 : deltaY is in pixels
        // deltaMode 1 : deltaY is in lines (needs to be scaled)

        e.pinch = {
          pageX: e.pageX,
          pageY: e.pageY,
          dr: delta
        }

        handler.apply(this, arguments);
        e.preventDefault();
      });

      this.on('touchend touchcancel', function(e) {
        this.pinch = undefined;
      });

      return this;
    },


    /*
     * $(selector).pan(handler)
     */
    pan: function(handler) {
      this.on('touchstart mousedown', function(e) {
        if(!e.touches || e.touches.length == 1) {
          this.pan = get_pos(e);

          // OS should not be using this event
          e.preventDefault();
        }
      });

      this.on('touchmove mousemove', function(e) {
        if(this.pan && (!e.touches || e.touches.length == 1)) {
          const pos = get_pos(e);

          if(!this.pan_enabled) {
            const dist = get_mdist(pos, this.pan);
            if(dist > PAN_TAP_THRESHOLD) this.pan_enabled = true;
          }

          if(this.pan_enabled) {
            e.pan = get_pan(pos, this.pan);
            this.pan = pos;

            handler.apply(this, arguments);
          }
        }
      });

      this.on('touchend touchcancel mouseup mouseout', function(e) {
        this.pan = this.pan_enabled = undefined;
      });

      return this;
    },


    /*
     * $(selector).tap(handler)
     */
    tap: function(handler) {
      this.on('touchstart mousedown', function(e) {
        if(!e.touches || e.touches.length == 1) {
          this.tap = get_pos(e);
          this.tap_travel = 0;

          // OS should not be using this event
          e.preventDefault();
        }
      });

      this.on('touchmove mousemove', function(e) {
        if(this.tap && (!e.touches || e.touches.length == 1)) {
          const dist = get_mdist(get_pos(e), this.tap);
          this.tap_travel = Math.max(dist, this.tap_travel);
        }
      });

      this.on('touchend mouseup', function(e) {
        if(this.tap) {
          e.tap = this.tap;
          e.touches = [this.tap];
          if(this.tap_travel <= PAN_TAP_THRESHOLD) handler.apply(this, arguments);
        }

        this.tap = this.tap_travel = undefined;
      });

      this.on('touchcancel mouseout', function(e) {
        this.tap = this.tap_travel = undefined;
      });

      return this;
    }
  });
})(jQuery);

