var $myModal = $('#myModal');

// Checks to see if browser online
online = window.navigator.onLine;
window.addEventListener("offline", function(e) {alert("Please check your internet connection!");});

window.addEventListener("online", function(e) {alert("Internet onnection is back up!");});

var mapOptions = {
  zoom: 14,
  center: new google.maps.LatLng(42.4850931, -71.43284) // Sets the location for the google map api
};
var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

var content = document.createElement("DIV");

// Upon clicking markers on google map, this is the infowindow that pops up.  Sets the size
var infowindow = new google.maps.InfoWindow({
  content: content,
  maxWidth: 200
});

//make cursor appear in search bar automatically
var setFocus = function() {
  var input = document.getElementById ("theFieldID");
  input.focus ();
  };
setFocus();

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
  this.nameTitle = ko.computed(function() {
 return this.name() + " " + this.title();
 }, this);

	// This is the info in the infowindow that pops up when marker is clicked
	// _blank opens link in new tab, not in current tab so it does not exit google map
	this.infoHtml = ko.computed(function() {
		console.log("inside infoHtml, web: " + web);
  		return '<h4>'+ name + '</h4>' + '<img src=' + pic +
    	'>' + '<br>' + title + '</br>' + '<br>' + phone + '</br>' + '<br>' + '<a href="' + web + '" target="_blank">Visit Site' + '</a><br>';
 	}, this);

	
	// Create marker for location on google map.  Contains name, title, position and content for marker.
	this.marker = new google.maps.Marker({
		name: name,
		title: title,
    	position: new google.maps.LatLng(latitude,longitude),
    	map: map,
    	content: this.infoHtml()
	});

	// listener to add the information window to each marker
 	google.maps.event.addListener(this.marker, 'click', function() {
 		//console.log("marker event web: " + web);
    	infowindow.setContent('<h4>'+ name + '</h4>' + '<img src=' + pic +
        '>' + '<br>' + title + '</br>' + '<br>' + phone + '</br>' +
        '<br>' + '<a href="' + web + '" target="_blank">Visit Site' + '</a><br>');
        console.log('<a href="' + web + '" target="_blank">Visit Site' + '</a><br>');
        infowindow.open(map, this);
	});
}

var markers = [];

// This is the initial list of locations to be added to markers
var locationList = [new Location("Acton Arboretum", "Park", "Taylor Rd", "(978) 264-9631", 42.480561, -71.434777, "images/arboretum.jpg", "http://www.actonarboretum.org"),
          new Location("Discovery Museum", "Museum", "177 Main St", "(978) 264-4200", 42.4647833, -71.4561531, "images/dm_face.jpg", "http://www.discoverymuseums.org"),
          new Location("Grassy Pond Conservation Area", "Park", "Acton", "(978) 929-6640", 42.501478, -71.448746, "images/grassypondpanorama.jpg" , "http://actontrails.org/DescGrassyPond.htm")
  ];

// The locations that fourSquare api will be used to find
var fourSquareList = {
	sorrento: '4b33e50bf964a5206c2125e3',
	dunkindonut: '4b7f0326f964a520421030e3',
	starbucks: '4b1aa48df964a52032ee23e3',
	londonpizza: '4aa57324f964a5206a4820e3',
	actongas: '4c4c9036c668e21ebae9b1fb'
};

// Sets the map on all markers in the array.
// If map is passed in, sets markers on map.
// If null is passed in, it removes the markers on map instead.
var setAllMap = function setAllMap(map) {
  console.log("setAllMap: marker.length: " + markers.length);
  for (var i = 0; i < markers.length; i++) {
  	console.log(i);
    var mark = markers[i];
    mark.setMap(map);
  }
}

// Clears the markers on the map
function clearMarkers() {
  console.log("clearing markers on map, by setting setAllMap to null");
  setAllMap(null);
}

// Display markers on map
function showMarkers() {
  console.log("inside showMarkers, ready to show markers in array by setting setAllMap to map");
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  console.log("deleting markers");
  clearMarkers();
  markers = [];
}

/* ===== View ===== */
var displayMapModel = function() {

	var self = this;

	//console.log("inside displayLocation");

  self.showMenu = ko.observable(false);
  self.toggleMenu = function () {
    $( ".location-button-def" ).toggle('fast');
  };

	//function to add a marker to the markers array
  var addMarker = function () {
    for (var i = 0; i < self.places().length; i++) {
      markers.push(self.places()[i].marker);
      //mark.setMap(map);
      //console.log("added marker");
    }
 	};

 	// add markers to list
 	for (var i =0; i < locationList.length; i++) {
 		markers.push(locationList[i].marker);
 	}

  // Data initially loaded
  var loadData = function (){
    self.places = ko.observableArray();
    self.placeMarkers = function() {
      console.log("placeMarkers: places length: " + self.places().length);
      for (var i = 0; i < self.places().length; i++) {
        addMarker();
        }
        showMarkers();
    };

    // Ajax call for places in foursquare
    for (var venue in fourSquareList) {
		  var id = fourSquareList[venue];
      var urlFourSquare = 'https://api.foursquare.com/v2/venues/' + id + '?&client_id=EWW4OGHIEC44JKVDUQF2VYOVIT4LEHYN5D13QZDOTFGDXA2C' +
         	'&client_secret=VCN1IO4NYUBECLHW3I2IXXNK55CJ3532ESM53IGGSCFC11ET&v=20151027&m=foursquare';

		  $.ajax({
		    url: urlFourSquare,
        dataType: 'jsonp',
        success: function(response){  // If successful call, pull these data from foursquare
          var venue = response.response.venue;
          var name = venue.name;
          var id = venue.id;
          var location = venue.location;
          var categories = venue.categories[0].name;
          var urlVenue = venue.url;
          var latitude = venue.location.lat;
          var longitude = venue.location.lng;
          var address = venue.location.address;
          var phone = venue.contact.formattedPhone;

          // If photo does not exist, use stock image
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

          // Push the info into locationList
          locationList.push(new Location( name, categories, address, phone, latitude, longitude, photoUrl, urlVenue));

          self.places(locationList.slice(0));
          self.placeMarkers();  // put into marker
        },
          error: function (){
            $myModal.modal('show');
          }
      });
    }
	};

  // loadData is run first time app.js is accessed
  loadData();

  /*  This is the search bar for google map
   *  In real time as user is typing in the search
   *  the search bar will filter the markers in memory
   *  and display only the markers that still fit
   *  the criteria of the search.  In this case
   *  the search is set to the location's name and
   *  title 
   */
	self.filter = ko.observable('');
	self.temp = ko.observableArray();
  self.search = function () {
    	map.setCenter({lat: 42.4850931, lng: -71.43284});
    	infowindow.close();
    	var filter = self.filter();
      console.log("right before deleteMarker running");
    	deleteMarkers();
    	self.places.removeAll();
      console.log("places length: " + self.places.length);
    	var len = locationList.length;
    	for (var i = 0; i < len; i++) {
    		if ((locationList)[i].nameTitle().toLowerCase().indexOf(filter.toLowerCase()) >= 0 ) {
        		self.temp().push(locationList[i]);    
        	}
    	}
    	if (self.temp().length === 0) {
    		self.places.push(new Place('No match your search', "", '', '', '', ''));
    	}
    	self.places(self.temp());
    	self.placeMarkers();
  };

  //
  self.listClick = function(place) {
    var mark = place.marker;
    google.maps.event.trigger(mark,"click");
  };

};

ko.applyBindings(new displayMapModel());