// HTML Code that use the below JS function
// @Html.TextBoxFor(m => m.FirstName, new { @class = "searchbox" })
//  <button type="submit" onclick="return validate();">Submit</button>

// JS Function
// function validate() {
// 	var firstname = document.getElementById('FirstName');
//   var alpha = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
// 	if (firstname.value == '') {
// 		alert('Please enter Name');
// 		return false;
// 	} else if (!firstname.value.match(alpha)) {
// 		alert('Invalid ');
// 		return false;
// 	} else {
// 		return true;
// 	}
// }

let eventSearchUrl = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=eIMh2CGNhtUTSybN21TU3JRes1j9raV3&radius=50&sort=date,asc&classificationName=[music]&unit=miles&city=${
  this.state.cityToSearch
}`;
