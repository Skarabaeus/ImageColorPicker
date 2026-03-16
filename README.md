Image Color Picker
===================================================================

What does it do?
----------------

Image Color Picker allows you to pick the color of any pixel in an image using an HTML5 `<canvas>` overlay.

Check out the `example` folder for details.


Usage (no dependencies)
-----------------------

Include the script and (optionally) the CSS:

```html
<link rel="stylesheet" href="dist/ImageColorPicker.css">
<script src="src/ImageColorPicker.js"></script>
```

Then instantiate `ImageColorPicker` for any `<img>` element:

```html
<img src="example/test.png" id="myImage">
<div id="colorResult"></div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    var img = document.getElementById("myImage");

    new ImageColorPicker(img, {
      afterColorSelected: function (color) {
        // color is a hex string like "#a1b2c3"
        document.getElementById("colorResult").textContent = color;
      }
    });
  });
  </script>
```

API
---

- `new ImageColorPicker(imgElement, options)`
  - **`imgElement`**: an `<img>` DOM element.
  - **`options.afterColorSelected`**: optional callback, called with a hex color string when the user clicks on the image.
- `instance.selectedColor()`
  - Returns the currently selected color as a hex string, e.g. `"#a1b2c3"`.
- `instance.destroy()`
  - Removes the canvas overlay and restores the original image in the DOM.


Notes
-----

- The image must be loaded from the same origin as the page (or served with permissive CORS headers), otherwise browsers will block access to pixel data.
- The original jQuery/jQuery UI plugin and build tooling have been removed in favor of this lightweight, dependency-free implementation.
