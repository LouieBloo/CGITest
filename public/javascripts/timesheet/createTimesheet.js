console.log("JS Loaded...");

var lineItemCount = 1;

//when the page is safely loaded
$(document).ready(function(){
	//setup onedit listeners for the rate
	$('#rate').on('input',calculateTotals);
	setupLineItemListeners();
});

//adds a line item to the form, fetched from server
function addLineItem(){

	clearError();

	if(lineItemCount < 10){
		lineItemCount++;//increment before ajax call so no race conditions
		$.ajax({
			url: '../components/lineItem',
			success: function(data){
				$('#lineItems').append(data);
				setupLineItemListeners();//when adding a new line item, update the input listeners
			},
			error: function(error){
				console.log(error);
				lineItemCount--;
				showError(error);
				
			}
		});
	}
	else{
		showError("Maxium 10 line items!");
	}
}

//calculates the total time and cost of the timesheet
function calculateTotals(){
	var rate = parseInt($('#rate').val());//grab the current rate
	var allTimes =  $("input[name='times']");//grab all elements that match the name times
	var totalCost = 0;
	var totalMinutes = 0;
	if(!isNaN(rate)){
		
		for(var x = 0; x < allTimes.length;x++){
			var mins = !isNaN(parseInt(allTimes[x].value)) ? parseInt(allTimes[x].value) : 0;
			totalMinutes += mins;
			totalCost += mins * rate;
		};

		//set new time and minutes to the dom
		$('#totalTime').html(totalMinutes + " mins");
		$('#totalCost').html("$" + totalCost);
	}
}

//clears any listeners and sets new ones for all line items
//used so when a user changes a value on a line item the totals update automatically
function setupLineItemListeners(){
	$("input[name='times']").off();
	$("input[name='times']").on('input',calculateTotals);
}

//shows any errors in the form
function showError(error){
	$('#error').html(error);
}

//clears all errors on the form
function clearError(){
	showError("");
}



