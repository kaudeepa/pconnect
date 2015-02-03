var rootURL = "http://localhost/pros_connect/api";
var page_url = null;

var selection = 'f_';
var selected_fields = [];
selected_fields.length = 0;

$(".removeBtn").live('click',function () {
	$(this).html('Add').removeClass('removeBtn').addClass('addBtn').css("background-color","green");
	var currentKey = $(this).attr("id");
	var currentValue = $(this).prev();
	delete selected_fields[currentKey];
	console.log(selected_fields);
});

$(".addBtn").live('click',function () {
	var field = {};
	$(this).html('Remove').removeClass('addBtn').addClass('removeBtn').css("background-color","yellow");
	var currentKey = $(this).attr("id");
	field.id = $(this).prev().attr("id");
	if (typeof field.id === "undefined"){
		field.id = "not available";
	}
	field.name = $(this).prev().attr("name");
	if (typeof field.name === "undefined"){
		field.name = "not available";
	}
	field.type = $(this).prev().attr("elmenttype");
	field.value = "";
	if($(this).prev().val()){
		field.default_value = $(this).prev().val();
	}
	else{
		field.default_value = "";
	}
	field.html = $("<div/>").append($(this).prev().clone()).html();
	selected_fields[currentKey] = field;
	console.log(selected_fields);
});

$('#submitvalue').click(function(){
	var submitValue = {};

	var fields_array = [];
	fields_array.length = 0;
	
	for ( var item in selected_fields ){
		fields_array.push( selected_fields[ item ] );
	}

	submitValue.fields 	= fields_array;
	submitValue.page_url = page_url;
	if(submitValue.page_url != null){
		$.ajax({
				type: "POST",
				contentType: 'application/json',
				data: JSON.stringify(submitValue, null, 2),
				url: rootURL + '/setfields',
				dataType: "json",
				success: function(data, textStatus, jqXHR){
					console.log(data);
					console.log(textStatus);
					console.log(jqXHR);
			}
		});
	}
});

$('#clickme').click(function(){
	page_url = $('#pageurl').val();
	console.log(page_url);
	if (page_url != null){
		$("#pageContent").html('Loading...');
		$.ajax({
				type: "POST",
				url: rootURL + '/fetchcontent',
				data: JSON.stringify({"page_url": page_url}, null, 2),
				success: function(data){
					$("#pageContent").html(data);
					highlightFields();
				},
				error: function(data){
					$("#pageContent").html("Sorry, file was not found.");
				}
		});
	}
});

$('#highlightFields').click(function(){
	highlightFields();
});

function highlightFields() {

	if($('.highlight') != null)
		$('.highlight').removeClass('highlight');
	if($('.addBtn') != null)
		$('.addBtn').remove();
	if($('.removeBtn') != null)
		$('.removeBtn').remove();

	selected_fields = [];
	selected_fields.length = 0;
	
	if($('#pageContent a[href]') != null){
		$('#pageContent a[href]').each(function(){
			$(this).addClass('highlight');
			$(this).attr('elmenttype', 'clickable');
		});
	}
	if($('#pageContent :text') != null){
		$('#pageContent :text').each(function() {
			$(this).addClass('highlight');
			$(this).attr('elmenttype', 'textfield');
		});
	}
	if($('#pageContent :checkbox') != null){	
		$('#pageContent :checkbox').each(function() {
			$(this).addClass('highlight');
			$(this).attr('elmenttype', 'checkbox');		
		});
	}
	if($('textarea') != null){
		$('textarea').each(function() {
			$(this).addClass('highlight');
			$(this).attr('elmenttype', 'textarea');
		});			
	}
	if($('#pageContent :radio') != null){
		$('#pageContent :radio').map(function() {
			$(this).addClass('highlight');
			$(this).attr('elmenttype', 'radio');
		});
	}
	if($('#pageContent select') != null){
		$('#pageContent select').each(function() {
			$(this).addClass('highlight');
			$(this).attr('elmenttype', 'dropdown');
		});
	}
	var idx = 0;
	if($('.highlight') != null){
		$('.highlight').each(function() {
				var buttonString = '<button type="button" class="addBtn" id="' + selection + idx + '">Add</button>';
				$(this).after(buttonString);
				idx++;
		});
		$(".addBtn").css("background-color","green");
	}
};
