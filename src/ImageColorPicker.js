var uiImageColorPicker = function(){

	var _d2h = function(d) {
		var result;
		if (parseInt(d)) {
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

		// create additional DOM elements.
		widget.$currentColor = $('<div class="currentColor"></div>');
		widget.$selectedColor = $('<div class="selectedColor"></div>');
		widget.$canvas = $('<canvas class="ImageColorPickerCanvas"></canvas>');
		widget.$toolbox = $('<div class="ImageColorPickerToolBox"></div>');

		// add them to the DOM
		widget.element.wrap('<div class="ImageColorPickerWrapper"></div>');
		widget.$wrapper = widget.element.parent();
		widget.$wrapper.append(widget.$canvas);
		widget.$wrapper.append(widget.$toolbox);
		widget.$toolbox.append(widget.$currentColor);
		widget.$toolbox.append(widget.$selectedColor);

		// try to get canvas context.
		var ctx = null;

		if (typeof(widget.$canvas.get(0).getContext) === 'function') { // FF, Chrome, ...
			ctx = widget.$canvas.get(0).getContext('2d');
			
		// this does not work yet!	
		} else if (typeof(G_vmlCanvasManager) !== 'undefined') { // IE, with excanvas
			var ieCanvasElement = G_vmlCanvasManager.initElement(widget.$canvas.get(0));
			var ctx = ieCanvasElement.getContext('2d');
			
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
		ctx.drawImage(img, 0, 0); 

		// get the image data.
		try {
			try { 
				widget.imageData = ctx.getImageData(0, 0, img.width, img.height);	
			} catch (e1) { 
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				widget.imageData = ctx.getImageData(0, 0, img.width, img.height);	
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
			var offset = that.$canvas.offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			var pixel = ((y * img.width) + x) * 4;
			var imageData = that.imageData;
			that.$currentColor.css("backgroundColor", "rgba(" + imageData.data[pixel] 
				+ ", " + imageData.data[(pixel + 1)] 
				+ ", " + imageData.data[(pixel + 2)] 
				+ ", " + imageData.data[(pixel + 3)] 
				+ ")");
		}); 

		widget.$canvas.bind("click", function(e){
			var offset = that.$canvas.offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			var pixel = ((y * img.width) + x) * 4;
			var imageData = that.imageData;
			that.$selectedColor.css("backgroundColor", "rgba(" + imageData.data[pixel] 
				+ ", " + imageData.data[(pixel + 1)] 
				+ ", " + imageData.data[(pixel + 2)] 
				+ ", " + imageData.data[(pixel + 3)] 
				+ ")");
			that._trigger("afterColorSelected", 0, that.selectedColor());
		}); 

		widget.$canvas.bind("mouseleave", function(e){
			that.$currentColor.css("backgroundColor", "#fff");
		});

		// hope that helps to prevent memory leaks
		$(window).unload(function(e){
			that.destroy();
		});
	};



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
			this.$currentColor.remove();
			this.$selectedColor.remove();
			this.$canvas.remove();
			this.$toolbox.remove();
			this.element.unwrap();
			this.element.show();
		},

		selectedColor: function() {
			var color = this.$selectedColor.css("backgroundColor");
			var red = 255;
			var green = 255;
			varblue = 255;		
			var rgbvals = null;

			if (color.substring(0, 1) === '#') {
				red = _h2d(color.substring(0,2));
				green = _h2d(color.substring(2, 2));
				blue = _h2d(color.substring(4, 2));
			} else if (color.substring(0, 4) === 'rgba') {
				rgbvals = /rgba\((.+),(.+),(.+)\)/i.exec(color); 
				red = rgbvals[1].trim();
				green = rgbvals[2].trim();
				blue = rgbvals[3].trim();
			} else if (color.substring(0, 3) === 'rgb') {
				rgbvals = /rgb\((.+),(.+),(.+)\)/i.exec(color); 
				red = rgbvals[1].trim();
				green = rgbvals[2].trim();
				blue = rgbvals[3].trim();
			} 

			return "#" + _d2h(red) + _d2h(green) + _d2h(blue);
		}

	};	
}();
