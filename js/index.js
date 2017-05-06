function geoFindMe() {
  if (!navigator.geolocation) return;

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude + " " + longitude);
  }

  function error(){
  	console.log("Error on geoFindMe function.");
  	return;
  }
  navigator.geolocation.getCurrentPosition(success, error);
}