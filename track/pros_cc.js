var rootURL = "http://localhost/pros_connect/api";

var autoRefreshInput = null;
var clicked_values = {};
var enabled_fields = {};
var fetched_fields = {};

$(document).click(function(event){
			var tempObject = $(event.target);
			if(fetched_fields.length){
				var tempHTML = tempObject.html();
				var tempId = tempObject.attr("id");
				var tempName = tempObject.attr("name");

				if(tempId !== undefined ){
					for ( var item in fetched_fields ){
					if ((fetched_fields[item].type == "clickable") && (tempId == fetched_fields[item].id)) {
						fetched_fields[item].value = "clicked";
					}

				}

			}
			else if (tempName !== undefined ){
					for ( var item in fetched_fields ){
					if ((fetched_fields[item].type == "clickable") && (tempName == fetched_fields[item].name)) {
						fetched_fields[item].value = "clicked";
					}

				}

			}
			else if (tempHTML != ""){
					for ( var item in fetched_fields ){
					var s = fetched_fields[item].html;
					if ((fetched_fields[item].type == "clickable") && (s.indexOf(tempHTML) != -1)) {
						fetched_fields[item].value = "clicked";
					}

				}

			}
		}
});

$('#clicktocall').click(function() {
	createPopup();
});

$(window).load(function() {	
		$.ajax({
			type: "GET",
			url: rootURL + "/initialize",	
			dataType: "json",
			success: function(msg){
				console.log(msg);
			}
		});
	
		$.ajax({
			type: "GET",
			url: rootURL + "/fields",	
			dataType: "json",
			success: function(msg){
			if(msg['fields']){
				fetched_fields = enabled_fields = msg['fields'];
				for ( var item in fetched_fields ){
					fetched_fields[item].value = "NA";
				}
			}
		}
	});
	
	if (!autoRefreshInput){
			autoRefreshInput = setInterval(function () {
			var data = fetchData();
				submitData(fetched_fields);
			}, 60000);
			}
});



$(window).unload(function() {
		var data = fetchData();	
		submitData(fetched_fields);
	if (autoRefreshInput) {
		clearInterval(autoRefreshInput);
		autoRefreshInput = null;
	}
});

createPopup = function() {
		$.ajax({
			type: "GET",
			url: rootURL + "/fieldswithvalues",	
			dataType: "json",
			success: function(msg){
				$("#frameDemo").html( JSON.stringify(msg, null, 2) );
		}
	});
}

submitData = function(data) {
if(enabled_fields.length){
			$.ajax({
			type: 'PUT',
			contentType: 'application/json',
			url: rootURL + '/fields',
			dataType: "json",
			data: JSON.stringify(data, null, 2),
			success: function(data, textStatus, jqXHR){
				console.log('updated successfully');
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('update error: ' + textStatus);
			}
		});
	}
}

fetchData = function(){
    var data ={};
	data.clicked_values = clicked_values;

	if(enabled_fields.length){
		var fetched_fields = enabled_fields;

		for ( var item in fetched_fields ){
				var id = fetched_fields[item].id;
				var elementType = fetched_fields[item].type;
				var name = fetched_fields[item].name;
				var default_value = fetched_fields[item].default_value;

			switch(elementType){			
				case 'checkbox':
					var value_filter = "[value=" + default_value + "]";
					if(id != "not available"){
							var id_selector = "#" + id;
							if($(id_selector).filter(value_filter).attr("checked")){
								fetched_fields[item].value = "checked";
							}
							else{
								fetched_fields[item].value = "unchecked";
							}
					}
					else if(name != "not available"){
							var name_selector = "[name=" + name + "]";
							if($(name_selector).filter(value_filter).attr("checked")){
								fetched_fields[item].value = "checked";
							}
							else{
								fetched_fields[item].value = "unchecked";
							}
					}
					break;
				case 'radio':
					var value_filter = "[value=" + default_value + "]";
					if(id != "not available"){
							var id_selector = "#" + id;
							if($(id_selector).filter(value_filter).is(':checked')) {
								fetched_fields[item].value = "checked" ;
							}
							else{
								fetched_fields[item].value = "unchecked";
							}
					}
					else if(name != "not available"){
							var name_selector = "[name=" + name + "]";				
							if($(name_selector).filter(value_filter).is(':checked')) {
								fetched_fields[item].value = "checked" ;
							}
							else{
								fetched_fields[item].value = "unchecked" ;
							}
					}
					
					break;
				case "textfield":
				case 'textarea':
					if(id != "not available"){
							var id_selector = "#" + id;
							fetched_fields[item].value = $(id_selector).attr("value");
					}
					else if(name != "not available"){
							var name_selector = "[name=" + name + "]";
							fetched_fields[item].value = $(name_selector).attr("value");
					}
					break;
				case 'dropdown':
						if(id != "not available"){
							var id_selector = "#" + id;
							fetched_fields[item].value = $(id_selector).attr("value");
					}
					else if(name != "not available"){
							var name_selector = "[name=" + name + "]";
							fetched_fields[item].value = $(name_selector).attr("value");
					}
					break;
				case 'clickables':
						// is there a way to find out if a link has been visited?
					break;
				default:
					break;	
			}
	    }
	}
}
