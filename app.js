// declare global variable
var map;
// 1. load the google map
function initMap() {
	// create a map
	var mapOptions = {
		center: {
			lat: 37.338208,
			lng: -121.886329
		},
		zoom: 11,
		scrollwheel: false,
		styles: [{
			"featureType": "poi",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#747474"
			}, {
				"lightness": "23"
			}]
		}, {
			"featureType": "poi.attraction",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#f38eb0"
			}]
		}, {
			"featureType": "poi.government",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#ced7db"
			}]
		}, {
			"featureType": "poi.medical",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#ffa5a8"
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#c7e5c8"
			}]
		}, {
			"featureType": "poi.place_of_worship",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#d6cbc7"
			}]
		}, {
			"featureType": "poi.school",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#c4c9e8"
			}]
		}, {
			"featureType": "poi.sports_complex",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#b1eaf1"
			}]
		}, {
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [{
				"lightness": "100"
			}]
		}, {
			"featureType": "road",
			"elementType": "labels",
			"stylers": [{
				"visibility": "off"
			}, {
				"lightness": "100"
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#ffd4a5"
			}]
		}, {
			"featureType": "road.arterial",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#ffe9d2"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "all",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "geometry.fill",
			"stylers": [{
				"weight": "3.00"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "geometry.stroke",
			"stylers": [{
				"weight": "0.30"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#747474"
			}, {
				"lightness": "36"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "labels.text.stroke",
			"stylers": [{
				"color": "#e9e5dc"
			}, {
				"lightness": "30"
			}]
		}, {
			"featureType": "transit.line",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "on"
			}, {
				"lightness": "100"
			}]
		}, {
			"featureType": "water",
			"elementType": "all",
			"stylers": [{
				"color": "#d2e7f7"
			}]
		}]
	};
	var mapDiv = document.getElementById('map');
	map = new google.maps.Map(mapDiv, mapOptions);
	ko.applyBindings(new viewModel()); // activate knockout
}
// google map load error function using jquery
function googleError() {
	$('header').append('<h2> Oops!! something went wrong. This page didnot load google map. Refresh again</h2>');
}

// 2. Model
var Locations = [{
	name: 'Swaad Indian Cuisine',
	lat: 37.350680,
	lng: -121.884255,
	yelpid: 'swaad-indian-cuisine-san-jose'
}, {
	name: 'Spice N Flavor',
	lat: 37.365702,
	lng: -121.851522,
	yelpid: 'spice-n-flavor-san-jose-2'
}, {
	name: 'Kettle’e',
	lat: 37.352009,
	lng: -121.954643,
	yelpid: 'kettlee-santa-clara'
}, {
	name: 'Curry Roots',
	lat: 37.251468,
	lng: -121.862208,
	yelpid: 'curry-roots-san-jose'
}, {
	name: 'Aachi Aappakadai',
	lat: 37.373327,
	lng: -122.052293,
	yelpid: 'aachi-aappakadai-sunnyvale'
}, {
	name: 'Naan-N-Masala',
	lat: 37.433154,
	lng: -121.885675,
	yelpid: 'naan-n-masala-milpitas'
}, {
	name: "Red Chillies",
	lat: 37.428162,
	lng: -121.906481,
	yelpid: 'red-chillies-milpitas-2'
}, {
	name: 'Amber India',
	lat: 37.319356,
	lng: -121.948621,
	yelpid: 'amber-india-restaurant-san-jose'
}, {
	name: "Darbar Indian Cuisine",
	lat: 37.444829,
	lng: -122.165101,
	yelpid: 'darbar-indian-cuisine-palo-alto'
}];
// 3. javascript constructor
var Restaurant = function(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.lat = ko.observable(data.lat);
	self.lng = ko.observable(data.lng);
	self.yelpid = ko.observable(data.yelpid);
	self.marker = ko.observable();
	self.contentString = ko.observable('');
};
// 4. ViewModel
var viewModel = function() {
	var self = this;
	// define infowindow
	var infowindow = new google.maps.InfoWindow({
			maxWidth: 200
		}),
		image = 'images/icon.png'; // marker image
	self.restaurants = ko.observableArray([]); // array of restaurants
	//call the constructor
	Locations.forEach(function(restaurantItem) {
		self.restaurants.push(new Restaurant(restaurantItem));
	});

	//yelpNotLoading observable
		self.yelpNotLoading = ko.observable("");
	// 5. set markers
	self.restaurants().forEach(function(restaurantItem) {
		//define markers
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(restaurantItem.lat(), restaurantItem.lng()),
			map: map,
			icon: image,
			animation: google.maps.Animation.DROP
		});
		restaurantItem.marker = marker;
		// 6. implement Yelp API.
		// Generate a random number for use in Yelp API Oauth.
		function nonce_generate() {
			return (Math.floor(Math.random() * 1e12).toString());
		}
		var yelp_url = 'https://api.yelp.com/v2/business/' + restaurantItem.yelpid(),
			consumer_secret = "xxxxxxxxxxxxxxxxxxxxxxx",
			token_secret = "xxxxxxxxxxxxxxxxxxxxxxx",
			parameters = {
				oauth_consumer_key: 'xxxxxxxxxxxxxxxxxx',
				oauth_token: 'xxxxxxxxxxxxxxxxxxxxx',
				oauth_nonce: nonce_generate(),
				oauth_timestamp: Math.floor(Date.now() / 1000),
				oauth_signature_method: 'HMAC-SHA1',
				oauth_version: '1.0',
				callback: 'cb',
			},
			//Generate Oauth signature
			encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, consumer_secret, token_secret);
		parameters.oauth_signature = encodedSignature;
		var request = $.ajax({
			url: yelp_url,
			data: parameters,
			cache: true,
			dataType: 'jsonp'
		}).done(function(data) {
			var phone = data.display_phone,
				rating = data.rating_img_url,
				snippet = data.snippet_text,
				link = data.url,
				image = data.image_url,
				address = data.location.display_address,
				category = data.categories[0][0];
			// Create info window that displays information of a place.
			restaurantItem.contentString = '<div><h3>' + restaurantItem.name() + '</h3>' + '<p><strong>Category: </strong>' + category + '</p>' + '<p><strong>Address: </strong>' + address + '</p>' + '<p><strong>Phone: </strong>' + phone + '</p>' + '<p><strong>Yelp Ratings: </strong>' + '<img src="' + rating + '"></p>' + '<p><strong>Reviews: </strong>' + snippet + '</p>' + '<p><a href="' + link + '">checkout more about restaurant</a></p>' + '</div>';
			// 7  Add infowindow
			google.maps.event.addListener(restaurantItem.marker, 'click', function() {
				infowindow.setContent(restaurantItem.contentString); // set yelp API contents in window
				infowindow.open(map, restaurantItem.marker); // open the infowindow
				restaurantItem.marker.setAnimation(google.maps.Animation.BOUNCE); // marker animation
				setTimeout(function() {
					restaurantItem.marker.setAnimation(null);
				}, 1400);
			});
		}).fail(function(e) {
			// display the message on left side if Yelp API fails to implement
			self.yelpNotLoading('<h3> Oops!! yelp data is not available once you click on markers.Please check the credentails again. </h3>');
		});
		// 8.LocationLists Observable Array
		self.locationList = ko.observableArray();
		// push all the restaurant data  into locationList
		self.restaurants().forEach(function(resto) {
			self.locationList.push(resto);
		});
		// 9. Visible Observable Array containing markers based on search
		self.visible = ko.observableArray();
		// All markers are visible by default
		self.locationList().forEach(function(resto) {
			self.visible.push(resto);
		});
		// 10. Show the marker when the user clicks the list
		self.showMarker = function(restaurantItem) {
			google.maps.event.trigger(restaurantItem.marker, 'click');
		};
		// 11. search observable
		self.search = ko.observable('');
		// 12. Filtering the restarant locations
		self.filter = function() {
			filter = self.search().toLowerCase();
			//close current infowindows when user try to search on box
			infowindow.close();
			self.visible.removeAll();
			self.locationList().forEach(function(resto) {
				resto.marker.setVisible(false);
				// If user input is included in the name, set marker as visible
				if (resto.name().toLowerCase().indexOf(filter) !== -1) {
					self.visible.push(resto);
				}
			});
			self.visible().forEach(function(resto) {
				resto.marker.setVisible(true);
			});
		}; //filter close
	}); //locationlist close
}; // view model close
