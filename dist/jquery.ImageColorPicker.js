/*!
* jQuery ImageColorPicker Plugin v0.1
* http://github.com/Skarabaeus/ImageColorPicker
*
* Copyright 2010, Stefan Siebel
* Licensed under the MIT license.
* http://github.com/Skarabaeus/ImageColorPicker/MIT-LICENSE.txt
* 
* Released under the MIT
*
* Date: Sat Aug 7 18:08:15 2010 +0200
*/

$.widget("ui.ImageColorPicker", {
	// default options
	options: {

	},
	_create: function() {
		if (this.element.get(0).tagName.toLowerCase() === 'img') {
      if (this.element.get(0).complete) {
				this._createImageColorPicker();
      } else {
				this.element.bind('load', { that: this }, function(e){
					var that = e.data.that;
					that._createImageColorPicker();
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
			red = this._h2d(color.substring(0,2));
			green = this._h2d(color.substring(2, 2));
			blue = this._h2d(color.substring(4, 2));
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

		return "#" + this._d2h(red) + this._d2h(green) + this._d2h(blue);
	},
	
	_d2h: function(d) {
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
	},
	
	_h2d: function(h) {
		return parseInt(h,16);
	},
   
	_createImageColorPicker: function() {
	
		// create additional DOM elements.
    this.$currentColor = $('<div class="currentColor"></div>');
    this.$selectedColor = $('<div class="selectedColor"></div>');
    this.$canvas = $('<canvas class="ImageColorPickerCanvas"></canvas>');
    this.$toolbox = $('<div class="ImageColorPickerToolBox"></div>');

		// add them to the DOM
    this.element.wrap('<div class="ImageColorPickerWrapper"></div>');
    this.$wrapper = this.element.parent();
    this.$wrapper.append(this.$canvas);
    this.$wrapper.append(this.$toolbox);
    this.$toolbox.append(this.$currentColor);
    this.$toolbox.append(this.$selectedColor);
    
    // get canvas context.
    var ctx = this.$canvas.get(0).getContext('2d');

		// draw the image in the canvas
	  var img = new Image();
	  img.src = this.element.attr("src");
		this.$canvas.attr("width", img.width);
		this.$canvas.attr("height", img.height);
		ctx.drawImage(img, 0, 0); 

		// get the image data.
    try {
			try { 
        this.imageData = ctx.getImageData(0, 0, img.width, img.height);  
      } catch (e1) { 
        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        this.imageData = ctx.getImageData(0, 0, img.width, img.height);  
			}
    } catch (e2) {
    	this.destroy();
      throw new Error("ImageColor Picker: Unable to access image data. "
      	+ "This could be either due " 
      	+ "to the browser you are using (IE doesn't work) or image and script "
      	+ "are saved on different servers or you run the script locally. "
      	+ "The exception is: " + e2);
    } 
    
    // hide the original image
    this.element.hide();
    
    // for usage in events
    var that = this;
    
    this.$canvas.bind("mousemove", function(e){
	    var offset = that.$canvas.offset();
	    var x = e.pageX - offset.left;
	    var y = e.pageY - offset.top;
			var pixel = ((y * img.width) + x) * 4;
			var imageData = that.imageData;
      that.$currentColor.css("backgroundColor", "rgba(" + imageData.data[pixel] + ", " + imageData.data[(pixel + 1)] + ", " + imageData.data[(pixel + 2)] + ", " + imageData.data[(pixel + 3)] + ")");
    }); 
    
    this.$canvas.bind("click", function(e){
	    var offset = that.$canvas.offset();
	    var x = e.pageX - offset.left;
	    var y = e.pageY - offset.top;
			var pixel = ((y * img.width) + x) * 4;
			var imageData = that.imageData;
      that.$selectedColor.css("backgroundColor", "rgba(" + imageData.data[pixel] + ", " + imageData.data[(pixel + 1)] + ", " + imageData.data[(pixel + 2)] + ", " + imageData.data[(pixel + 3)] + ")");
      that._trigger("afterColorSelected", 0, that.selectedColor());
    }); 
    
    this.$canvas.bind("mouseleave", function(e){
      that.$currentColor.css("backgroundColor", "#fff");
    });
    
    // hope that helps to prevent memory leaks
    $(window).unload(function(e){
    	that.destroy();
    });
	}
});

