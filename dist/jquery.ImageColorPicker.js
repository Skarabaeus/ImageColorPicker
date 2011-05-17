/*!
* jQuery ImageColorPicker Plugin v0.2
* http://github.com/Skarabaeus/ImageColorPicker
*
* Copyright 2010, Stefan Siebel
* Licensed under the MIT license.
* http://github.com/Skarabaeus/ImageColorPicker/MIT-LICENSE.txt
* 
* Released under the MIT
*
* Date: Tue May 17 11:20:16 2011 -0700
*/
(function(){
var uiImageColorPicker = function(){

	var _d2h = function(d) {
		var result;
		if (! isNaN( parseInt(d) ) ) {
			result = parseInt(d).toString(16);
		} else {
			result = d;
		}

		if (result.length === 1) {
			result = "0" + result;
		}
		return result;
	};

	var _h2d = function(h) {
		return parseInt(h,16);
	};

	var _createImageColorPicker = function(widget) {
		// store 2D context in widget for later access
		widget.ctx = null;

		// rgb
		widget.color = [0, 0, 0];

		// create additional DOM elements.
		widget.$canvas = $('<canvas class="ImageColorPickerCanvas"></canvas>');

		// add them to the DOM
		widget.element.wrap('<div class="ImageColorPickerWrapper"></div>');
		widget.$wrapper = widget.element.parent();
		widget.$wrapper.append(widget.$canvas);

		if (typeof(widget.$canvas.get(0).getContext) === 'function') { // FF, Chrome, ...
			widget.ctx = widget.$canvas.get(0).getContext('2d');

		// this does not work yet!
		} else {
			widget.destroy();
			if (console) {
				console.log("ImageColor Picker: Can't get canvas context. Use "
					+ "Firefox, Chrome or include excanvas to your project.");
			}

		}

		// draw the image in the canvas
		var img = new Image();
		img.src = widget.element.attr("src");
		widget.$canvas.attr("width", img.width);
		widget.$canvas.attr("height", img.height);
		widget.ctx.drawImage(img, 0, 0);

		// get the image data.
		try {
			try {
				widget.imageData = widget.ctx.getImageData(0, 0, img.width, img.height);
			} catch (e1) {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				widget.imageData = widget.ctx.getImageData(0, 0, img.width, img.height);
			}
		} catch (e2) {
			widget.destroy();
			if (console) {
				console.log("ImageColor Picker: Unable to access image data. "
					+ "This could be either due "
					+ "to the browser you are using (IE doesn't work) or image and script "
					+ "are saved on different servers or you run the script locally. ");
			}
		}

		// hide the original image
		widget.element.hide();

		// for usage in events
		var that = widget;

		widget.$canvas.bind("mousemove", function(e){
      var point = imageCoordinates( that, e.pageX, e.pageY );
      var color = lookupColor( that.imageData, point );

      updateCurrentColor( that, color.red, color.green, color.blue );
		});

		widget.$canvas.bind("click", function(e){
      var point = imageCoordinates( that, e.pageX, e.pageY );
      var color = lookupColor( that.imageData, point );

      updateSelectedColor( that, color.red, color.green, color.blue );
			that._trigger("afterColorSelected", 0, that.selectedColor());
		});

		widget.$canvas.bind("mouseleave", function(e){
			updateCurrentColor(that, 255, 255, 255);
		});

		// hope that helps to prevent memory leaks
		$(window).unload(function(e){
			that.destroy();
		});
	};

  // for pageX and pageY, determine image coordinates using offset
  var imageCoordinates = function( widget, pageX, pageY ) {
    var offset = widget.$canvas.offset();

    return { x: Math.round( pageX - offset.left ),
             y: Math.round( pageY - offset.top ) };
  }

  // lookup color values for point [x,y] location in image
  var lookupColor = function( imageData, point) {
    var pixel =  ((point.y * imageData.width) + point.x) * 4;

    return { red: imageData.data[pixel],
             green: imageData.data[(pixel + 1)],
             blue: imageData.data[(pixel + 2)] }

  }

	var updateCurrentColor = function(widget, red, green, blue) {
		var c = widget.ctx;
		var canvasWidth = widget.$canvas.attr("width");
		var canvasHeight = widget.$canvas.attr("height");

		// draw current Color
		c.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
		c.fillRect (canvasWidth - 62, canvasHeight - 32, 30, 30);

		// draw border
		c.lineWidth = "3"
		c.lineJoin = "round";
		c.strokeRect (canvasWidth - 62, canvasHeight - 32, 30, 30);
	}

	var updateSelectedColor = function(widget, red, green, blue) {
		var c = widget.ctx;
		var canvasWidth = widget.$canvas.attr("width");
		var canvasHeight = widget.$canvas.attr("height");

		// draw current Color
		c.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
		c.fillRect (canvasWidth - 32, canvasHeight - 32, 30, 30);

		// draw border
		c.lineWidth = "3"
		c.lineJoin = "round";
		c.strokeRect (canvasWidth - 32, canvasHeight - 32, 30, 30);

		// set new selected color
		var newColor = [red, green, blue];
		widget.color = newColor;
	}

	return {
		// default options
		options: {

		},

		_create: function() {
			if (this.element.get(0).tagName.toLowerCase() === 'img') {
				if (this.element.get(0).complete) {
					_createImageColorPicker(this);
				} else {
					this.element.bind('load', { that: this }, function(e){
						var that = e.data.that;
						_createImageColorPicker(that);
					});
				}
			}
		},

		destroy: function() {
			// default destroy
			$.Widget.prototype.destroy.apply(this, arguments);

			// remove possible large array with pixel data
			this.imageData = null;

			// remove additional elements
			this.$canvas.remove();
			this.element.unwrap();
			this.element.show();
		},

		selectedColor: function() {
			return "#" + _d2h(this.color[0]) + _d2h(this.color[1]) + _d2h(this.color[2]);
		}

	};
}();
	$.widget("ui.ImageColorPicker", uiImageColorPicker);
})();
