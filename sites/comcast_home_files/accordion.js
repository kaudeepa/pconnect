		$(document).ready(function(){
			
            $(".accordion span.qs:first").addClass("active");
			$(".accordion p:not(:first)").hide();
		
			$(".accordion span.qs").click(function(){
				$(this).next("p").slideToggle("fast") 
				.siblings("p:visible").slideUp("fast");
				$(this).toggleClass("active");
				$(this).siblings("span.qs").removeClass("active");
			});
		
		});
		
		
		
		$(document).ready(function(){
			
            $(".accordion-2 span.qs:first").addClass("active");
			$(".accordion-2 p:not(:first)").hide();
		
			$(".accordion-2 span.qs").click(function(){
				$(this).next("p").slideToggle("fast")
				.siblings("p:visible").slideUp("fast");
				$(this).toggleClass("active");
				$(this).siblings("span.qs").removeClass("active");
			});
		
		});
		
		
		$(document).ready(function(){
			
            $(".accordion-3 span.qs:first").addClass("active");
			$(".accordion-3 p:not(:first)").hide();
		
			$(".accordion-3 span.qs").click(function(){
				$(this).next("p").slideToggle("fast")
				.siblings("p:visible").slideUp("fast");
				$(this).toggleClass("active");
				$(this).siblings("span.qs").removeClass("active");
			});
		
		});