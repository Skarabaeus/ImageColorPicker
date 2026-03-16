;(function() {
  "use strict";

  function d2h(d) {
    var result;
    if (!isNaN(parseInt(d, 10))) {
      result = parseInt(d, 10).toString(16);
    } else {
      result = d;
    }

    if (result.length === 1) {
      result = "0" + result;
    }
    return result;
  }

  function imageCoordinates(canvas, event) {
    var rect = canvas.getBoundingClientRect();

    var x = Math.round(event.clientX - rect.left);
    var y = Math.round(event.clientY - rect.top);

    return { x: x, y: y };
  }

  function lookupColor(imageData, point) {
    var pixel = ((point.y * imageData.width) + point.x) * 4;

    return {
      red: imageData.data[pixel],
      green: imageData.data[pixel + 1],
      blue: imageData.data[pixel + 2]
    };
  }

  function ImageColorPicker(imgElement, options) {
    if (!imgElement || imgElement.tagName.toLowerCase() !== "img") {
      throw new Error("ImageColorPicker expects an <img> element.");
    }

    this.img = imgElement;
    this.options = options || {};
    this.color = [0, 0, 0];
    this.canvas = document.createElement("canvas");
    this.canvas.className = "ImageColorPickerCanvas";
    this.ctx = null;
    this.imageData = null;
    this.wrapper = null;

    this._onMouseMove = null;
    this._onClick = null;
    this._onMouseLeave = null;

    this._wrapImage();
    this._initWhenImageReady();
  }

  ImageColorPicker.prototype._wrapImage = function() {
    var wrapper = document.createElement("div");
    wrapper.className = "ImageColorPickerWrapper";

    var parent = this.img.parentNode;
    if (parent) {
      parent.insertBefore(wrapper, this.img);
      wrapper.appendChild(this.img);
    }

    wrapper.appendChild(this.canvas);
    this.wrapper = wrapper;
  };

  ImageColorPicker.prototype._initWhenImageReady = function() {
    var self = this;

    function init() {
      self._initCanvasFromImage();
    }

    if (this.img.complete && (this.img.naturalWidth || this.img.width)) {
      init();
    } else {
      this.img.addEventListener("load", init, { once: true });
    }
  };

  ImageColorPicker.prototype._initCanvasFromImage = function() {
    if (!this.canvas.getContext) {
      if (typeof console !== "undefined" && console.log) {
        console.log("ImageColorPicker: Canvas is not supported in this browser.");
      }
      return;
    }

    this.ctx = this.canvas.getContext("2d");

    var width = this.img.naturalWidth || this.img.width;
    var height = this.img.naturalHeight || this.img.height;

    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx.drawImage(this.img, 0, 0, width, height);

    try {
      this.imageData = this.ctx.getImageData(0, 0, width, height);
    } catch (e) {
      if (typeof console !== "undefined" && console.log) {
        console.log("ImageColorPicker: Unable to access image data. " +
          "This is usually caused by cross-origin images.");
      }
      this.destroy();
      return;
    }

    this.img.style.display = "none";
    this._bindEvents();
  };

  ImageColorPicker.prototype._bindEvents = function() {
    var self = this;

    this._onMouseMove = function(e) {
      if (!self.imageData) {
        return;
      }
      var point = imageCoordinates(self.canvas, e);
      var color = lookupColor(self.imageData, point);
      self._updateCurrentColor(color.red, color.green, color.blue);
    };

    this._onClick = function(e) {
      if (!self.imageData) {
        return;
      }
      var point = imageCoordinates(self.canvas, e);
      var color = lookupColor(self.imageData, point);

      self._updateSelectedColor(color.red, color.green, color.blue);

      if (typeof self.options.afterColorSelected === "function") {
        self.options.afterColorSelected(self.selectedColor());
      }
    };

    this._onMouseLeave = function() {
      self._updateCurrentColor(255, 255, 255);
    };

    this.canvas.addEventListener("mousemove", this._onMouseMove);
    this.canvas.addEventListener("click", this._onClick);
    this.canvas.addEventListener("mouseleave", this._onMouseLeave);
  };

  ImageColorPicker.prototype._updateCurrentColor = function(red, green, blue) {
    var c = this.ctx;
    var canvasWidth = this.canvas.width;
    var canvasHeight = this.canvas.height;

    c.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
    c.fillRect(canvasWidth - 62, canvasHeight - 32, 30, 30);

    c.lineWidth = 3;
    c.lineJoin = "round";
    c.strokeRect(canvasWidth - 62, canvasHeight - 32, 30, 30);
  };

  ImageColorPicker.prototype._updateSelectedColor = function(red, green, blue) {
    var c = this.ctx;
    var canvasWidth = this.canvas.width;
    var canvasHeight = this.canvas.height;

    c.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
    c.fillRect(canvasWidth - 32, canvasHeight - 32, 30, 30);

    c.lineWidth = 3;
    c.lineJoin = "round";
    c.strokeRect(canvasWidth - 32, canvasHeight - 32, 30, 30);

    this.color = [red, green, blue];
  };

  ImageColorPicker.prototype.selectedColor = function() {
    return "#" + d2h(this.color[0]) + d2h(this.color[1]) + d2h(this.color[2]);
  };

  ImageColorPicker.prototype.destroy = function() {
    if (this.canvas) {
      this.canvas.removeEventListener("mousemove", this._onMouseMove);
      this.canvas.removeEventListener("click", this._onClick);
      this.canvas.removeEventListener("mouseleave", this._onMouseLeave);
    }

    this.imageData = null;

    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.insertBefore(this.img, this.wrapper);
      this.wrapper.parentNode.removeChild(this.wrapper);
    }

    this.img.style.display = "";
    this.canvas = null;
    this.wrapper = null;
  };

  window.ImageColorPicker = ImageColorPicker;
})();
