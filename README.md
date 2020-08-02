# Pinchpan JavaScript Libraries

JavaScript libraries to detect pinch, swipe, and tap events on mobile devices,
and scroll, click-drag, and click events on desktop devices.  Used on
[subwayhere.com].

## Modules

* [src/pinchpan.js]: For detecting pinch, pan, and tap events.
* [src/zoomable.js]: Uses pinchpan.js to zoom/pan elements (typically an image).

Both modules require [jQuery].

## Usage

The libraries provide jQuery methods for detecting pinch, swipe, and tap pseudo
events and call a handler.

pinchpan.js provides the following methods:
  * ```.pinch(handler)``` calls the handler when the user pinches (on a mobile
    device) or scrolls (on a desktop device). The handler is passed the last
    underlying touch or wheel event ```e```, along with the pinch position
    (```e.pinch.pageX``` and ```e.pinch.pageY```) and the amount pinched since
    the last call to the handler (```e.pinch.dr```).
  * ```.pan(handler)``` calls the handler when the user swipes (on a mobile
    device) or click-drags (on a desktop device). The handler is passed the
    last underlying touch or mouse event ```e```, along with the amount panned
    since the last call to the handler (```e.pan.dx``` and ```e.pan.dy```).
  * ```.tap(handler)``` calls the handler when the user taps (on a mobile
    device) or clicks (on a desktop device). The handler is passed the
    underlying touch or mouse event ```e```, along with the position of the tap
    (```e.tap.pageX``` and ```e.tap.pageY```).

zoomable.js provides the following methods:
  * ```.zoomable(handler)``` calls the handler on pinch and pan events after
    having zoomed or panned the selector (typically an image). The handler is
    passed the last pinch or pan pseudo event ```e```, along with the amount
    zoomed since the last call to the handler (```e.zoom.zf```, where 1 means
    no zoom) and the amount panned since the last call to the handler
    (```e.zoom.dx``` and ```e.zoom.dy```). The pan amount is given relative to
    the top-left corner of the selector, which may change even when no pan
    occurs on a pure pinch-only event.

  * ```.tappable(handler)``` calls the handler on tap events. The handler is
    passed the last tap psudo event ```e```, along with the tap position
    (```e.click.imgX``` and ```e.click.imgY```) expressed as a percentage of
    the overall size of the selector, where 1.0 means 100%. The position given
    as a percentage may be used to translate where the tap event occurred
    regardless of the zoom level.

## Example

See [test/index.html] for an example and [subwayhere.com] for a real-life usage.

  [jQuery]: https://jquery.com/
  [src/pinchpan.js]: src/pinchpan.js
  [src/zoomable.js]: src/zoomable.js
  [test/index.html]: test/index.html
  [subwayhere.com]: https://subwayhere.com/picker2.html

