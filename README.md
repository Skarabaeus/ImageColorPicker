[Image Color Picker](http://github.com/Skarabaeus/ImageColorPicker)
===================================================================

WARNING
-------
Image Color Picker is in a very early state of development and not quite
ready for production usage.

What does it do?
----------------

Image Color Picker allows you to pick the color of a pixel of an image.

Check out the [example folder](http://github.com/Skarabaeus/ImageColorPicker/tree/master/example)
for details.

There's also a working demo available [here](http://www.project-sierra.de/ImageColorPicker/example/)

In order to use the plugin you need to include the [jQuery](http://jquery.com) library and at least the Core and Widget module of the [jQuery UI](http://jqueryui.com/) library.


What you need to build your own ImageColorPicker
------------------------------------------------
Make sure that you have Java installed .
If not, [go to this page](http://java.sun.com/javase/downloads/index.jsp) and download "Java Runtime Environment (JRE) 5.0"

How to build Image Color Picker
-------------------------------

Build the minified version of Image Color Picker:

    rake min

Test Image Color Picker against JSLint:

    rake lint

Remove all build files:

    rake clean


