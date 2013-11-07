(function($){
	var methods = {
		init : function( options ) {			
			return this.each(function(){
				
				var settings = $.extend( $.fn.slidegallery.defaults, options);

				var $slidegallery = $(this),
					data = $slidegallery.data("slidegallery"),
					$sliderOut = $slidegallery.find(settings.sliderOut),
					$sliderIn = $sliderOut.find(settings.sliderIn),
					$controls = $slidegallery.find(settings.controls),
					$others = $slidegallery.find(settings.others),
					$left = $controls.find(".left"),
					$right = $controls.find(".right"),
					buttonAction = settings.buttonAction,
					p = settings.percentages;

				//Configuración
				
				if($sliderIn.length <= 0 && $sliderOut.length <= 0){
					$sliderIn = $slidegallery.children().not($controls).not($others).wrapAll("<div></div>").parent().addClass("sliderIn");
					$sliderOut = $sliderIn.wrap("<div></div>").parent().addClass("sliderOut");
				}

				if(!p)
					$sliderOut.css({
						width : settings.width + settings.widthUnit,
						height : settings.height + settings.heightUnit,
						overflow : "hidden"
					});
				else
					$sliderOut.css({						
						width : settings.width + "%",
						height : "auto",
						overflow : "hidden"
					});

				if(settings.fixOthers){
					if(!p)
						$others.children().css({
							width : (settings.width - 20) + settings.widthUnit,
							"min-height" : (settings.height - 20) + settings.heightUnit,
							padding : 10 + "px"
						});
					else
						$others.children().css({
							width : settings.width + "%",
							padding : 10 + "px",						
							"-webkit-box-sizing": "border-box",
							"-moz-box-sizing": "border-box",
							"-o-box-sizing": "border-box",
							"box-sizing": "border-box"
						});
				}
				
				$sliderIn.find(":first-child").clone().appendTo($sliderIn);
				
				if(!p)
					$sliderIn.css({
						width : settings.width * $sliderIn.children().length + settings.widthUnit,
						height : settings.height + settings.heightUnit,
						position : "relative",
						right : 0 + "px"
					});
				else{
					$sliderIn.css({
						width : 100 * $sliderIn.children().length + "%",
						height : 100 + "%",
						position : "relative",
						right : 0 + "%"
					});

					$sliderIn.children().css({
						width: 100 / $sliderIn.children().length + "%",
					})
				}


				if($controls.length <= 0){
					$controls = $("<div />").addClass("controls");
					$left = $("<span/>").addClass("left").text(" < ");
					$right = $("<span/>").addClass("right").text(" > ");
					$controls.prepend($right);
					$controls.prepend($left);
					$slidegallery.prepend($controls);
				}

				$controls.css({cursor: "pointer"});

				if ( !data ){
					$slidegallery.data(
						"slidegallery", 
						{ 
							$sliderIn : $sliderIn,
							$sliderOut : $sliderOut,
							$left : $left,
							$right : $right
						});
				}

				//Funcionalidad
				$right.click(function(){
					if($($slidegallery).filter(":animated").length == 0){
						var position;
						var r = $sliderIn.css("right");
						if(!p)
							position = Math.round(parseFloat($sliderIn.css("right")) / settings.width);
						else if(r.indexOf("%") == -1 ){
							position = Math.round((parseFloat($sliderIn.css("right"))/parseFloat($sliderIn.parent().width())));
						}else{
							position = Math.round((parseFloat($sliderIn.css("right"))/100));
						}

						var children = $sliderIn.children().length;
						
						if(typeof buttonAction == "function"){
							var actualPosition = position;
							if(actualPosition == children - 2)
								actualPosition = -1;
							if(actualPosition == children - 1)
								actualPosition = 0;

							actualPosition ++;
							buttonAction(actualPosition)
						}

						position ++;
						
						if(position == $sliderIn.children().length){
							if(!p)
								$sliderIn.css({
									right : 0 + "px"
								});
							else
								$sliderIn.css({
									right : 0 + "%"
								});
							position = 1;
						}
						if(!p)
							$sliderIn.animateCss({
								right : position * settings.width + settings.widthUnit
							})
						else
							$sliderIn.animateCss({
								right : position * 100 + "%"
							})

					}
				})
				
				$left.click(function(){
					if($($slidegallery).filter(":animated").length == 0){
						var position;						
						if(!p)
							position = Math.round(parseFloat($sliderIn.css("right")) / settings.width);
						else if(r.indexOf("%") == -1 ){
							position = Math.round((parseFloat($sliderIn.css("right"))/parseFloat($sliderIn.parent().width())));
						}else{
							position = Math.round((parseFloat($sliderIn.css("right"))/100));
						}
						
						var children = $sliderIn.children().length;

						if(typeof buttonAction == "function"){
							var actualPosition = position;
							if(actualPosition == 0)
								actualPosition = children - 1;

							actualPosition --;
							buttonAction(actualPosition)
						}

						position --;

						if(position < 0){						
							position = $sliderIn.children().length - 1;
							if(!p)
								$sliderIn.css({
									right : position * settings.width + settings.widthUnit
								});
							else
								$sliderIn.css({
									right : position * 100 + "%"
								});
							position --;						
						}

						if(!p)
							$sliderIn.animateCss({
								right : position * settings.width + settings.widthUnit
							})
						else							
							$sliderIn.animateCss({
								right : position * 100 + "%"
							})
					}
				});

				var hashVal = window.location.hash.split("#")[1];
				if(hashVal){
					var position = parseInt(hashVal);
					var children = $sliderIn.children().length;
					
					if(typeof buttonAction == "function"){
						var actualPosition = position;
						if(actualPosition == 0)
							actualPosition = children - 1;
						
						actualPosition --;
						buttonAction(actualPosition);
					}

					if(position < 0){						
						position = $sliderIn.children().length - 1;
						if(!p)
							$sliderIn.css({
								right : position * settings.width + settings.widthUnit
							});
						else
							$sliderIn.css({
								right : position * 100 + "%"
							});
						position --;
					}

					if(!p)
						$sliderIn.animateCss({
							right : position * settings.width + settings.widthUnit
						})
					else
						$sliderIn.animateCss({
							right : position * 100 + "%"
						})
					$(document).scrollTop(0);
				}

				if(settings.callback)
					settings.callback();				
			});
		},
		destroy : function() {
			return this.each(function(){
				var $this = $(this),
					data = $this.data("slidegallery");

				$(window).unbind(".slidegallery");
				data.slidegallery.remove();
				$this.removeData("slidegallery");
			});
		}
	};

	$.fn.slidegallery = function ( method ) {
		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		}else if ( typeof method === "object" || ! method ){
			return methods.init.apply( this, arguments);
		}else{
			$.error( "Method " + method + " does not exist on jQuery.slidegallery" );
		}
	};

	$.fn.slidegallery.defaults = {
		"controls" : ".controls",
		"sliderIn" : ".sliderIn",
		"sliderOut" : ".sliderOut",
		"width" : 250,
		"widthUnit" : "px",
		"height" : 250,
		"heightUnit" : "px",
		"buttonAction" : function(){},
		"3d" : false,
		"others" : ".other",
		"fixOthers" : true,
		"percentages" : false
	}
	
})(jQuery);
