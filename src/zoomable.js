/*
 * Zoomable JavaScript Library v0.0.1
 * A part of the Pinchpan JavaScript Library suite
 * https://github.com/markuskimius/pinchpan
 *
 * Copyright Mark K. Kim
 * Released under the Apache license 2.0
 * https://github.com/markuskimius/pinchpan/blob/master/LICENSE
 */
(function($) {
  // How fast to zoom in / out.
  const ZOOM_RATE = 4;

  $.fn.extend({
    /*
     * $(selector).zoomable(zoom_handler).
     */
    zoomable: function(zoom_handler) {
      const orig_width = $(this).width();
      const orig_height = $(this).height();
      const orig_ratio = orig_width / orig_height;

      // Be sure to call this after resizing the image, if any
      function norm_off(_this, offset) {
        const pl = $(_this).parent().offset().left;
        const tp = $(_this).parent().offset().top;
        const l = pl + $(_this).parent().width() - $(_this).width();
        const t = tp + $(_this).parent().height() - $(_this).height();

        return {
          top: Math.max(Math.min(offset.top, tp), t),
          left: Math.max(Math.min(offset.left, pl), l)
        };
      }

      function norm_width(_this, width) {
        const pw = $(_this).parent().width();
        const ph = $(_this).parent().height();
        const w = Math.max(pw, ph * orig_ratio);

        return Math.max(width, w);
      }

      function norm_height(_this, height) {
        const pw = $(_this).parent().width();
        const ph = $(_this).parent().height();
        const h = Math.max(ph, pw / orig_ratio);

        return Math.max(height, h);
      }

      function zoom_to(_this, factor, cx, cy) {
        const w = $(_this).width() * factor;
        const h = $(_this).height() * factor;
        const af = norm_width(_this, w) / $(_this).width();
        const offset = $(_this).offset();
        const offset2 = {
          top: cy - cy * af + offset.top * af,
          left: cx - cx * af + offset.left * af
        }

        $(_this).width(norm_width(_this, w));
        $(_this).height(norm_height(_this, h));
        $(_this).offset(norm_off(_this, offset2));

        return {
          dx: $(_this).offset().left - offset.left,
          dy: $(_this).offset().top - offset.top,
          zf: $(_this).width() / w
        };
      }

      this.pinch(function(e) {
        const ref = $(window).width() + $(window).height();
        const zf = (ref + e.pinch.dr * ZOOM_RATE) / ref;

        e.zoom = zoom_to(this, zf, e.pinch.pageX, e.pinch.pageY);

        if(zoom_handler) {
          zoom_handler.apply(this, arguments);
        }
      });

      this.pan(function(e) {
        const offset = $(this).offset();
        const offset2 = {
          top: offset.top + e.pan.dy,
          left: offset.left + e.pan.dx
        };

        $(this).offset(norm_off(this, offset2));

        e.zoom = {
          dx: $(this).offset().left - offset.left,
          dy: $(this).offset().top - offset.top,
          zf: 1
        };

        if(zoom_handler) {
          zoom_handler.apply(this, arguments);
        }
      });

      // Set to default
      // zoom_to(this, 0);
    },

    /*
     * $(selector).tappable(tap_handler).
     */
    tappable: function(tap_handler) {
      this.tap(function(e) {
        const offset = $(this).offset();
        const w = $(this).width();
        const h = $(this).height();

        e.click = {
          imgX: (e.tap.pageX - offset.left) / w,
          imgY: (e.tap.pageY - offset.top) / h
        };

        if(tap_handler) {
          tap_handler.apply(this, arguments);
        }
      });

      return this;
    }
  });
})(jQuery);

