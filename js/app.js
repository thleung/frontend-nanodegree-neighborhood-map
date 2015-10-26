var mapOptions = {
  zoom: 14,
  center: new google.maps.LatLng(42.4850931, -71.43284)
};
var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

/* ===== Model ===== */
var Location = function( name, title, address, phone, latitude, longitude, pic, web) {

	// Attributes of model Location
	this.name = ko.observable(name);
	this.title = ko.observable(title);
	this.address = ko.observable(address);
	this.phone = ko.observable(phone);
	this.latitude = ko.observable(latitude);
	this.longitude = ko.observable(longitude);
	this.pic = ko.observable(pic);
	this.web = ko.observable(web);

	// Create marker to location on google map
	this.marker = new google.maps.Marker({
		name: name,
		title: title,
    	position: new google.maps.LatLng(latitude,longitude),
    	map: map,
    	web: web
	});

	function displayName() {
		var name = this.name;
   		console.log(name);
	}
}

/* ===== View ===== */
/*var locationList = [ new Location("Acton Arboretum", "Taylor Rd", "(978) 264-9631", 42.480561, -71.434777, "images/Not_available.jpg", "actonarboretum.org") ]; */

var locationList = [];
/* ===== Octopus ===== */
var displayLocation = function() {

	var self = this;

	console.log("inside displayLocation");
	locationList = [new Location("Acton Arboretum", "Park", "Taylor Rd", "(978) 264-9631", 42.480561, -71.434777, "images/Not_available.jpg", "www.actonarboretum.org"),
					new Location("Discovery Museum", "Museum", "177 Main St", "(978) 264-4200", 42.4647833, -71.4561531, "images/Not_available.jpg", "discoverymuseums.org")];

	//var loc = new Location("Acton Arboretum", "Park", "Taylor Rd", "(978) 264-9631", 42.480561, -71.434777, "images/Not_available.jpg", "www.actonarboretum.org");
	//loc.displayName();
	/*var list = [];
	for (var i=0; i<locationList.length; i++) {
		var mark = locationList[i].marker;
		console.log("pushed locationList");
		list.push(mark);
	}
	for (var i=0; i<list.length; i++) {
		console.log("inside list " + i);
		var mark = list[i];
		mark.setMap(map);
	}
	*/

/*
	var newmarker = new google.maps.Marker({
    	position: new google.maps.LatLng(42.480561, -71.434777),
    	title:"Hello World!"
	});
*/
/*	var newmarker = new google.maps.Marker({
		position: new google.maps.LatLng(locationList)
	})
*/
/*	newmarker.setMap(map) */

};

ko.applyBindings(new displayLocation());