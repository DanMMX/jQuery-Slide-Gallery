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
					$left = $controls.find(".left"),
					$right = $controls.find(".right"),
					buttonAction = settings.buttonAction;

				//Configuración

				if($sliderIn.length <= 0 && $sliderOut.length <= 0){
					$sliderIn = $slidegallery.children().not($controls).wrapAll("<div></div>").parent().addClass("sliderIn");
					$sliderOut = $sliderIn.wrap("<div></div>").parent().addClass("sliderOut");
				}

				$sliderOut.css({
					width : settings.width + settings.widthUnit,
					height : settings.height + settings.heightUnit,
					overflow : "hidden"
				});
				
				$sliderIn.find(":first-child").clone().appendTo($sliderIn);
				
				$sliderIn.css({
					width : settings.width * $sliderIn.children().length + settings.widthUnit,
					height : settings.height + settings.heightUnit,
					position : "relative",
					right : 0 + "px"
				});

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
						var position = Math.round(parseInt($sliderIn.css("right")) / settings.width);
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
							$sliderIn.css({
								right : 0 + "px"
							});
							position = 1;
						}
						
						$sliderIn.animate({
							right : position * settings.width + settings.widthUnit
						})
					}
				})

				$left.click(function(){
					if($($slidegallery).filter(":animated").length == 0){
						var position = Math.round(parseInt($sliderIn.css("right")) / settings.width);
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
							$sliderIn.css({
								right : position * settings.width + settings.widthUnit
							});
							position --;						
						}

						$sliderIn.animate({
							right : position * settings.width + settings.widthUnit
						})
					}
				});

				var hashVal = window.location.hash.split("#")[1];
				if(hashVal !== "undefined"){
					var position = parseInt(hashVal);
					var children = $sliderIn.children().length;
					
					if(typeof buttonAction == "function"){
						var actualPosition = position;
						if(actualPosition == 0)
							actualPosition = children - 1;
						
						actualPosition --;
						buttonAction(actualPosition)
					}

					if(position < 0){						
						position = $sliderIn.children().length - 1;
						$sliderIn.css({
							right : position * settings.width + settings.widthUnit
						});
						position --;						
					}

					$sliderIn.animate({
						right : position * settings.width + settings.widthUnit
					})
					$(document).scrollTop(0);
				}
				
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
		"buttonAction" : function(){}
	}
	
})(jQuery);