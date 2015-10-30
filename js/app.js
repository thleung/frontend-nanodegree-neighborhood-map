var mapOptions = {
  zoom: 14,
  center: new google.maps.LatLng(42.4850931, -71.43284)
};
var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

var content = document.createElement("DIV");
// variable that is the one and only info window of the page..content changes upon a click event
var infowindow = new google.maps.InfoWindow({
  content: content,
  maxWidth: 200
});

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

	// This is the info window that pops up when marker is clicked
	this.infoHtml = ko.computed(function() {
		console.log("MMMMMMMMMMMM: " + web);
  		return '<h4>'+ this.name + this.title + '</h4>' + '<img src=' + this.pic +
    	'>' + '<br>' + '<a href="' + this.web + '">Visit Site' + '</a><br>';
 	}, this);
	
	// Create marker to location on google map
	this.marker = new google.maps.Marker({
		name: name,
		title: title,
    	position: new google.maps.LatLng(latitude,longitude),
    	map: map,
    	content: this.infoHtml()
	});

	//listener to add the information window to each marker
 	google.maps.event.addListener(this.marker, 'click', function() {
    	infowindow.setContent('<h4>'+ this.name + this.title + '</h4>' + '<img src=' + pic +
        '>' + '<br>' + '<a href="' + this.web + '">Visit Site' + '</a><br>');
        infowindow.open(map, this);
	});
}

var locationList = [];

var fourSquareList = {
	sorrento: '4b33e50bf964a5206c2125e3',
	dunkindonut: '4b7f0326f964a520421030e3',
	starbucks: '4b1aa48df964a52032ee23e3',
	londonpizza: '4aa57324f964a5206a4820e3'
};

/* ===== View ===== */
var displayMapModel = function() {

	var self = this;

	console.log("inside displayLocation");

	// Markers for map
	locationList = [new Location("Acton Arboretum", "Park", "Taylor Rd", "(978) 264-9631", 42.480561, -71.434777, "images/arboretum.jpg", "www.actonarboretum.org"),
					new Location("Discovery Museum", "Museum", "177 Main St", "(978) 264-4200", 42.4647833, -71.4561531, "images/dm_face.jpg", "discoverymuseums.org")
	];

	console.log("calling for loop for foursquare at length");
	// Use ajax to call foursquare api to get information regarding places
	for (var venue in fourSquareList) {
		var id = fourSquareList[venue];
      	var urlFourSquare = 'https://api.foursquare.com/v2/venues/' + id + '?&client_id=EWW4OGHIEC44JKVDUQF2VYOVIT4LEHYN5D13QZDOTFGDXA2C' +
                	'&client_secret=VCN1IO4NYUBECLHW3I2IXXNK55CJ3532ESM53IGGSCFC11ET&v=20151027&m=foursquare';

		$.ajax({
			url: urlFourSquare,
			dataType: 'jsonp',
			success: function(response){
            	var venue = response.response.venue;
            	var name = venue.name;
            	var id = venue.id;
            	var location = venue.location;
            	var categories = venue.categories;
            	var urlVenue = venue.url;
            	var latitude = venue.location.lat;
            	var longitude = venue.location.lng;
            	var address = venue.location.address;
            	console.log("name: " + name);
            	console.log("id: " + id);
            	console.log("urlVenue:" + urlVenue);

            	// Photo image for location
            	var photoUrl;
            	if (typeof venue.photos.groups[0] === 'undefined') {
            		// There are no images for this venue on foursquare
            		photoUrl = "images/Not_available.jpg";
            	} else {
            		// There is at least one image for this venue on foursquare
            		// To create foursquare img link, combine .prefix + size + .suffix
            		var venuePrefix = venue.photos.groups[0].items[1].prefix;
            		var venueSuffix = venue.photos.groups[0].items[1].suffix;
            		photoUrl = venuePrefix + 150 + venueSuffix;
            	}
            	console.log("photo url: " + photoUrl);
            }
		});
	}
};

/* ===== Octopus ===== */

ko.applyBindings(new displayMapModel());