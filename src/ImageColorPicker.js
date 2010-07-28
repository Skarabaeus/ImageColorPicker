(function($) {

  $.fn.ImageColorPicker = function(settings) {

    // add default options here
    var config = {};

    var createImageColorPicker = function(that) {         
      var $this = $(that);
      var $currentColor = $('<div class="currentColor"></div>');
      var $selectedColor = $('<div class="selectedColor"></div>');
      var $canvas = $('<canvas class="ImageColorPickerCanvas"></canvas>');
      var $toolbox = $('<div class="ImageColorPickerToolBox"></div>');
      
      
      $this.wrap('<div class="ImageColorPickerWrapper"></div>');
      
      var $wrapper = $this.parent();
      
      $wrapper.append($canvas);
      $wrapper.append($toolbox);
      $toolbox.append($currentColor);
      $toolbox.append($selectedColor);
      
      var ctx = $canvas.get(0).getContext('2d');

		  var img = new Image();
		  img.onload = function(){  
		    ctx.drawImage(img, 0, 0); 

        try {
					try { 
            $canvas.data("ImageData", ctx.getImageData(0, 0, img.width, img.height));  
          } catch (e1) { 
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            $canvas.data("ImageData", ctx.getImageData(0, 0, img.width, img.height)); 
					}
        } catch (e2) {
          throw new Error("unable to access image data: " + e);
        } 
      };
      img.src = $this.attr("src");
      
      $canvas.attr("width", img.width);
      $canvas.attr("height", img.height);
      
      // hide the original image
      $this.hide();
      
      $canvas.bind("mousemove", function(e){
        
		    var offset = $canvas.offset();
		    var x = e.pageX - offset.left;
		    var y = e.pageY - offset.top;
				var pixel = ((y * img.width) + x) * 4;
				var imageData = $canvas.data("ImageData");
        $currentColor.css("backgroundColor", "rgba(" + imageData.data[pixel] + ", " + imageData.data[(pixel + 1)] + ", " + imageData.data[(pixel + 2)] + ", " + imageData.data[(pixel + 3)] + ")");
      }); 
      
      $canvas.bind("click", function(e){
        
		    var offset = $canvas.offset();
		    var x = e.pageX - offset.left;
		    var y = e.pageY - offset.top;
				var pixel = ((y * img.width) + x) * 4;
				var imageData = $canvas.data("ImageData");
        $selectedColor.css("backgroundColor", "rgba(" + imageData.data[pixel] + ", " + imageData.data[(pixel + 1)] + ", " + imageData.data[(pixel + 2)] + ", " + imageData.data[(pixel + 3)] + ")");
      }); 
      
      $canvas.bind("mouseleave", function(e){
        $currentColor.css("backgroundColor", "#fff");
      });
    };
  
    if (settings) {
			$.extend(config, settings);
    }
      
    this.each(function() {
        var that = this;
        
        // some magic to make sure the image is really loaded.
        if (that.tagName.toLowerCase() === 'img') {
          if (that.completed) {
            createImageColorPicker(that);
          } else {
            $(that).load(function(){
              createImageColorPicker(that);            
            });
          }
        }
        
    });
  
    return this;

  };

})(jQuery);
