/*
 *  dragging.js - v0.0.1
 *  A very small and simple plugin for dragging animation.
 *  https://vldvel.github.io/Dragging.js/demo/index.html
 *
 *  Made by 
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

	"use strict";

		var pluginName = "Dragging",
			defaults = {
				speed: 300,
				vertical: true,
				horizontal: true
			};

		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		$.extend( Plugin.prototype, {
			init: function() {
				this.activateDragging( this.settings );
			},
			activateDragging: function( settings ) {
				var thisElement = $(this.element),
					elOffset = thisElement.offset(),
					centerElement = [elOffset.left + thisElement.width() / 2, elOffset.top + thisElement.height() / 2],
					newPoint = [1, 1, 0, 0],
					startPoint = [],
					isDragging = false;
				if (isNaN(parseFloat(settings.speed)) && !isFinite(settings.speed)) {
					settings.speed = 300;
				}
				function calculateNewCoords(num1, num2, pageAl, elementProp) {
					if (startPoint[num1] > centerElement[num1]) {
						newPoint[num1] = 1 - (startPoint[num1] - pageAl) / settings.speed;
						if (newPoint[num1] < 1) {
							newPoint[num1] = 1;
						} else {
							newPoint[num2] = elementProp - (elementProp / newPoint[num1]);
						}
					} else {
						newPoint[num1] = 1 + (startPoint[num1] - pageAl) / settings.speed;
						if (newPoint[num1] < 1) {
							newPoint[num1] = 1;
						} else {
							newPoint[num2] = -1 * (elementProp - (elementProp / newPoint[num1]));
						}
					}
				}
				var stopDragging = function () {
					console.log("stop:" + isDragging);
					if (isDragging) {
						$( "body" ).off( "mousemove" );
						thisElement.css({"transition": "all 0.5s cubic-bezier(.44,.35,.1,2.19)", "transform": "matrix(1, 0, 0, 1, 0, 0)", "z-index": "1", "user-select": "unset"});
						stopDragging = false;
					}
				}
				thisElement.mousedown(function( event ) {
					thisElement.css({"transition": "none", "z-index": "99999", "user-select": "none"});
					startPoint = [event.pageX, event.pageY];
					isDragging = true;
					$( "body" ).mousemove(function( event ) {
						if (settings.horizontal) {
							calculateNewCoords(0, 2, event.pageX, thisElement.width());
						}
						if (settings.vertical) {
							calculateNewCoords(1, 3, event.pageY, thisElement.height());
						}						
						thisElement.css({"transform": "matrix(" + newPoint[0] + ", 0, 0, " +  newPoint[1] + ", " + newPoint[2] + ", " + newPoint[3] + ")"});
					});
				});
				thisElement.mouseup(stopDragging);
				$( "body" ).mouseup(stopDragging);
				return this;
			}
		} );

		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
