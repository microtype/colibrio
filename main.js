$(document).bind("ready", function(){
	
	// basic usage
	$("#message").maxlength();
	
	// subscribe to the "update.maxlength" event
	$("message").bind("update.maxlength", function(event, element, lastLength, length, maxLength, left){
		console.log(event, element, lastLength, length, maxLength, left);
	});
	
});